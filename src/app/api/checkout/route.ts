import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await auth();
    const userId = session?.user?.id;
    const body = await request.json();

    const {
      customer,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      shippingFee = 0,
      taxAmount = 0,
      discount = 0,
      totalAmount,
      paymentMethod = 'cod',
      customerNotes,
      sessionId,
    } = body;

    // Validation
    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { success: false, message: 'Customer name and email are required.' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return NextResponse.json(
        { success: false, message: 'Complete shipping address is required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot place order with an empty bag.' },
        { status: 400 }
      );
    }

    // Generate Order Number
    const latestOrder = await Order.findOne({}).sort({ createdAt: -1 }).lean();
    let nextNum = 1025;
    if (latestOrder && latestOrder.orderNumber) {
      const numPart = parseInt(latestOrder.orderNumber.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numPart)) {
        nextNum = numPart + 1;
      }
    }
    const orderNumber = `#${nextNum}`;

    // Create Order in MongoDB Atlas
    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone ? customer.phone.trim() : undefined,
        userId: userId || undefined,
      },
      shippingAddress: {
        fullName: shippingAddress.fullName || customer.name,
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2 ? shippingAddress.addressLine2.trim() : '',
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
        country: shippingAddress.country || 'India',
        phone: shippingAddress.phone || customer.phone || '',
      },
      billingAddress: billingAddress
        ? {
            fullName: billingAddress.fullName || customer.name,
            addressLine1: billingAddress.addressLine1.trim(),
            addressLine2: billingAddress.addressLine2 ? billingAddress.addressLine2.trim() : '',
            city: billingAddress.city.trim(),
            state: billingAddress.state.trim(),
            pincode: billingAddress.pincode.trim(),
            country: billingAddress.country || 'India',
            phone: billingAddress.phone || '',
          }
        : undefined,
      items: items.map((item) => ({
        productId: item.productId || item.slug,
        slug: item.slug,
        name: item.name,
        image: item.image || '/image1.jpg',
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        color: item.color || 'Standard',
        size: item.size || 'M',
        subtotal: Number(item.price) * (Number(item.quantity) || 1),
      })),
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      taxAmount: Number(taxAmount),
      discount: Number(discount),
      totalAmount: Number(totalAmount),
      currency: 'INR',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      channel: 'Online Store',
      paymentDetails: {
        gateway: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment',
      },
      fulfillmentStatus: 'unfulfilled',
      fulfillmentDetails: {
        courierName: 'Standard Express',
      },
      customerNotes: customerNotes ? customerNotes.trim() : undefined,
      staffNotes: [],
      timeline: [
        {
          title: `Order placed (${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'})`,
          description: `${items.length} item(s) ordered for ₹${Number(totalAmount).toLocaleString()}. Payment status: Pending.`,
          createdAt: new Date(),
          actor: customer.name || 'Customer',
        },
      ],
    });

    // Clear user cart in MongoDB Atlas
    const cartQuery = userId ? { userId } : sessionId ? { sessionId } : null;
    if (cartQuery) {
      await Cart.findOneAndUpdate(cartQuery, { items: [] });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} placed successfully!`,
      data: {
        id: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber,
        totalAmount: newOrder.totalAmount,
        customer: newOrder.customer,
        shippingAddress: newOrder.shippingAddress,
        items: newOrder.items,
        paymentStatus: newOrder.paymentStatus,
        paymentMethod: newOrder.paymentMethod,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error('API POST /api/checkout error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to process checkout order' },
      { status: 500 }
    );
  }
}
