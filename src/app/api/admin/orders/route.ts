import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET: Fetch all orders with search, filters, and KPI summary
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin role required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';
    const fulfillmentStatus = searchParams.get('fulfillmentStatus') || 'all';

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (fulfillmentStatus !== 'all') {
      query.fulfillmentStatus = fulfillmentStatus;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [result] = await Order.aggregate([
      {
        $facet: {
          orders: [
            ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
            { $sort: { createdAt: -1 } },
          ],
          stats: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                todayOrders: {
                  $sum: {
                    $cond: [{ $gte: ['$createdAt', today] }, 1, 0],
                  },
                },
                totalRevenue: {
                  $sum: {
                    $cond: [{ $eq: ['$paymentStatus', 'paid'] }, { $ifNull: ['$totalAmount', 0] }, 0],
                  },
                },
                ordersFulfilled: {
                  $sum: {
                    $cond: [
                      { $in: ['$fulfillmentStatus', ['fulfilled', 'delivered']] },
                      1,
                      0,
                    ],
                  },
                },
                ordersDelivered: {
                  $sum: {
                    $cond: [{ $eq: ['$fulfillmentStatus', 'delivered'] }, 1, 0],
                  },
                },
                itemsOrdered: {
                  $sum: {
                    $reduce: {
                      input: { $ifNull: ['$items', []] },
                      initialValue: 0,
                      in: {
                        $add: [
                          '$$value',
                          { $ifNull: ['$$this.quantity', 1] },
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    const statsData = result?.stats?.[0] || {};
    const stats = {
      todayOrders: statsData.todayOrders || 0,
      totalOrders: statsData.totalOrders || 0,
      itemsOrdered: statsData.itemsOrdered || 0,
      totalRevenue: Math.round((statsData.totalRevenue || 0) * 100) / 100,
      ordersFulfilled: statsData.ordersFulfilled || 0,
      ordersDelivered: statsData.ordersDelivered || 0,
    };

    return NextResponse.json({
      success: true,
      data: result?.orders || [],
      stats,
    });
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST: Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin role required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    // Generate Order Number
    const latestOrder = await Order.findOne({}).sort({ createdAt: -1 }).lean();
    let nextNum = 1001;
    if (latestOrder && latestOrder.orderNumber) {
      const numPart = parseInt(latestOrder.orderNumber.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const orderNumber = `#${nextNum}`;

    const newOrder = await Order.create({
      ...body,
      orderNumber,
      timeline: [
        {
          title: 'Order created',
          description: `Order ${orderNumber} created in admin portal`,
          createdAt: new Date(),
          actor: session.user.name || session.user.email || 'Admin',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} created successfully`,
      data: newOrder,
    });
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PATCH: Update order status, tracking, payment, or add staff notes
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin role required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { id, paymentStatus, fulfillmentStatus, trackingNumber, courierName, trackingUrl, newStaffNote } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const actor = session.user.name || session.user.email || 'Admin';

    // Update payment status
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      const prev = order.paymentStatus;
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid' && !order.paymentDetails?.paymentDate) {
        order.paymentDetails = {
          ...order.paymentDetails,
          paymentDate: new Date(),
        };
      }
      order.timeline.unshift({
        title: `Payment status changed to ${paymentStatus.toUpperCase()}`,
        description: `Status updated from ${prev} to ${paymentStatus}`,
        createdAt: new Date(),
        actor,
      });
    }

    // Update fulfillment status
    if (fulfillmentStatus && fulfillmentStatus !== order.fulfillmentStatus) {
      const prev = order.fulfillmentStatus;
      order.fulfillmentStatus = fulfillmentStatus;
      if (fulfillmentStatus === 'fulfilled') {
        order.fulfillmentDetails = {
          ...order.fulfillmentDetails,
          shippedDate: new Date(),
        };
      } else if (fulfillmentStatus === 'delivered') {
        order.fulfillmentDetails = {
          ...order.fulfillmentDetails,
          deliveredDate: new Date(),
        };
      }
      order.timeline.unshift({
        title: `Fulfillment status changed to ${fulfillmentStatus.toUpperCase()}`,
        description: `Status updated from ${prev} to ${fulfillmentStatus}`,
        createdAt: new Date(),
        actor,
      });
    }

    // Update courier/tracking
    if (trackingNumber !== undefined || courierName !== undefined || trackingUrl !== undefined) {
      order.fulfillmentDetails = {
        ...order.fulfillmentDetails,
        trackingNumber: trackingNumber ?? order.fulfillmentDetails?.trackingNumber,
        courierName: courierName ?? order.fulfillmentDetails?.courierName,
        trackingUrl: trackingUrl ?? order.fulfillmentDetails?.trackingUrl,
      };
      order.timeline.unshift({
        title: 'Tracking information updated',
        description: `Carrier: ${courierName || 'Standard Express'} · Waybill: ${trackingNumber || 'N/A'}`,
        createdAt: new Date(),
        actor,
      });
    }

    // Add staff comment / note
    if (newStaffNote && typeof newStaffNote === 'string' && newStaffNote.trim()) {
      const cleanNote = newStaffNote.trim();
      order.staffNotes = [...(order.staffNotes || []), cleanNote];
      order.timeline.unshift({
        title: 'Staff note added',
        description: cleanNote,
        createdAt: new Date(),
        actor,
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: `Order ${order.orderNumber} updated successfully`,
      data: order,
    });
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE: Cancel / remove order
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin role required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${order.orderNumber} deleted successfully`,
    });
  } catch (error: unknown) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to delete order' },
      { status: 500 }
    );
  }
}
