import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

const SAMPLE_ORDERS = [
  {
    orderNumber: '#1024',
    customer: {
      name: 'Arjun Sodhi',
      email: 'arjun.sodhi@example.com',
      phone: '+91 98765 43210',
    },
    shippingAddress: {
      fullName: 'Arjun Sodhi',
      addressLine1: 'B-402, Lodha Bellissimo, NM Joshi Marg',
      addressLine2: 'Mahalaxmi',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400011',
      country: 'India',
      phone: '+91 98765 43210',
    },
    items: [
      {
        slug: 'kaddy-top-in-cotton',
        name: 'Kaddy Top in Cotton',
        image: '/image1.jpg',
        price: 1650,
        quantity: 1,
        color: 'Black',
        size: 'M',
        subtotal: 1650,
      },
      {
        slug: 'alfidis-pant-in-cotton',
        name: 'Alfidis Pant in Cotton',
        image: '/image2.jpg',
        price: 1696.14,
        quantity: 1,
        color: 'Stone',
        size: 'M',
        subtotal: 1696.14,
      },
    ],
    subtotal: 3346.14,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 3346.14,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
    channel: 'Gokwik <> Last Summer',
    paymentDetails: {
      transactionId: 'pay_Nz8293740281',
      gateway: 'Razorpay / Gokwik',
      paymentDate: new Date('2026-08-17T19:33:00Z'),
    },
    fulfillmentStatus: 'fulfilled',
    fulfillmentDetails: {
      courierName: 'Blue Dart Express',
      trackingNumber: 'BLUEDART-8829104',
      trackingUrl: 'https://www.bluedart.com',
      shippedDate: new Date('2026-08-18T10:00:00Z'),
    },
    staffNotes: ['Customer requested signature on delivery.'],
    timeline: [
      {
        title: 'Order fulfilled',
        description: 'Dispatched via Blue Dart Express (Tracking: BLUEDART-8829104)',
        createdAt: new Date('2026-08-18T10:00:00Z'),
        actor: 'Admin',
      },
      {
        title: 'Payment confirmed ₹3,346.14',
        description: 'Payment verified via Razorpay Gokwik (pay_Nz8293740281)',
        createdAt: new Date('2026-08-17T19:33:00Z'),
        actor: 'Razorpay',
      },
      {
        title: 'Order placed by Arjun Sodhi',
        description: '2 items ordered for ₹3,346.14',
        createdAt: new Date('2026-08-17T19:33:00Z'),
        actor: 'Customer',
      },
    ],
  },
  {
    orderNumber: '#1023',
    customer: {
      name: 'Manuel Sevila',
      email: 'manuel.sevila@gmail.com',
      phone: '+91 98201 12345',
    },
    shippingAddress: {
      fullName: 'Manuel Sevila',
      addressLine1: 'Villa 14, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      country: 'India',
      phone: '+91 98201 12345',
    },
    items: [
      {
        slug: 'aura-silk-wrap-dress',
        name: 'Aura Silk Wrap Dress',
        image: '/image3.jpg',
        price: 3850,
        quantity: 1,
        color: 'Ivory',
        size: 'S',
        subtotal: 3850,
      },
      {
        slug: 'stella-slipper-in-leather',
        name: 'Stella Slipper in Leather',
        image: '/image4.jpg',
        price: 2751.14,
        quantity: 1,
        color: 'Black',
        size: '38',
        subtotal: 2751.14,
      },
    ],
    subtotal: 6601.14,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 6601.14,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    channel: 'Gokwik <> Last Summer',
    paymentDetails: {
      transactionId: 'pay_M8392019482',
      gateway: 'Razorpay',
      paymentDate: new Date('2026-08-06T08:22:00Z'),
    },
    fulfillmentStatus: 'delivered',
    fulfillmentDetails: {
      courierName: 'Delhivery Express',
      trackingNumber: 'DEL-99201847',
      trackingUrl: 'https://www.delhivery.com',
      shippedDate: new Date('2026-08-07T09:00:00Z'),
      deliveredDate: new Date('2026-08-09T14:30:00Z'),
    },
    staffNotes: ['Express packaging verified.'],
    timeline: [
      {
        title: 'Delivered to recipient',
        description: 'Successfully delivered by Delhivery',
        createdAt: new Date('2026-08-09T14:30:00Z'),
        actor: 'Delhivery',
      },
      {
        title: 'Order fulfilled',
        description: 'Dispatched via Delhivery Express',
        createdAt: new Date('2026-08-07T09:00:00Z'),
        actor: 'Admin',
      },
      {
        title: 'Payment confirmed ₹6,601.14',
        description: 'Processed via Card',
        createdAt: new Date('2026-08-06T08:22:00Z'),
        actor: 'Razorpay',
      },
    ],
  },
  {
    orderNumber: '#1022',
    customer: {
      name: 'Dinesh Mahankali',
      email: 'dinesh.m@outlook.com',
      phone: '+91 97112 34567',
    },
    shippingAddress: {
      fullName: 'Dinesh Mahankali',
      addressLine1: 'Flat 12B, Skydeck Towers, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India',
      phone: '+91 97112 34567',
    },
    items: [
      {
        slug: 'kabira-top-in-cotton',
        name: 'Kabira Top in Cotton',
        image: '/image2.jpg',
        price: 1673.07,
        quantity: 1,
        color: 'Grey',
        size: 'L',
        subtotal: 1673.07,
      },
    ],
    subtotal: 1673.07,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 1673.07,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    channel: 'Gokwik <> Last Summer',
    paymentDetails: {
      transactionId: 'upi_D729104829',
      gateway: 'UPI / PhonePe',
      paymentDate: new Date('2026-07-27T22:32:00Z'),
    },
    fulfillmentStatus: 'delivered',
    fulfillmentDetails: {
      courierName: 'Blue Dart',
      trackingNumber: 'BLUEDART-772910',
      shippedDate: new Date('2026-07-28T10:00:00Z'),
      deliveredDate: new Date('2026-07-30T16:00:00Z'),
    },
    timeline: [
      {
        title: 'Delivered',
        description: 'Delivered to Dinesh Mahankali',
        createdAt: new Date('2026-07-30T16:00:00Z'),
        actor: 'Blue Dart',
      },
    ],
  },
  {
    orderNumber: '#1019',
    customer: {
      name: 'Devraj Sheth',
      email: 'devraj.sheth@gmail.com',
      phone: '+91 99887 76655',
    },
    shippingAddress: {
      fullName: 'Devraj Sheth',
      addressLine1: '104, Kalpataru Horizon, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      country: 'India',
      phone: '+91 99887 76655',
    },
    items: [
      {
        slug: 'mirage-linen-pleated-skirt',
        name: 'Mirage Linen Pleated Skirt',
        image: '/image5.jpg',
        price: 3699,
        quantity: 1,
        color: 'Sand',
        size: 'M',
        subtotal: 3699,
      },
    ],
    subtotal: 3699,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 3699,
    currency: 'INR',
    paymentStatus: 'partially_paid',
    paymentMethod: 'cod',
    channel: 'Gokwik <> Last Summer',
    fulfillmentStatus: 'unfulfilled',
    customerNotes: 'Please deliver after 5 PM.',
    timeline: [
      {
        title: 'Order placed via COD',
        description: 'Advance token verified. Balance ₹3,199 payable upon delivery.',
        createdAt: new Date('2026-07-05T19:12:00Z'),
        actor: 'Customer',
      },
    ],
  },
  {
    orderNumber: '#1018',
    customer: {
      name: 'Akshay Chawla',
      email: 'akshay.chawla@gmail.com',
      phone: '+91 98111 22334',
    },
    shippingAddress: {
      fullName: 'Akshay Chawla',
      addressLine1: 'D-88, Defence Colony',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
      country: 'India',
      phone: '+91 98111 22334',
    },
    items: [
      {
        slug: 'kaddy-top-in-cotton',
        name: 'Kaddy Top in Cotton',
        image: '/image1.jpg',
        price: 1650,
        quantity: 1,
        color: 'Black',
        size: 'L',
        subtotal: 1650,
      },
      {
        slug: 'kabira-top-in-cotton',
        name: 'Kabira Top in Cotton',
        image: '/image2.jpg',
        price: 1696.14,
        quantity: 1,
        color: 'Stone',
        size: 'L',
        subtotal: 1696.14,
      },
    ],
    subtotal: 3346.14,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 3346.14,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
    channel: 'Gokwik <> Last Summer',
    paymentDetails: {
      transactionId: 'pay_Ak92810482',
      gateway: 'Razorpay',
      paymentDate: new Date('2026-07-04T14:11:00Z'),
    },
    fulfillmentStatus: 'unfulfilled',
    timeline: [
      {
        title: 'Payment confirmed ₹3,346.14',
        description: 'Razorpay transaction pay_Ak92810482 verified',
        createdAt: new Date('2026-07-04T14:11:00Z'),
        actor: 'Razorpay',
      },
      {
        title: 'Order placed',
        description: '2 garments ordered',
        createdAt: new Date('2026-07-04T14:11:00Z'),
        actor: 'Customer',
      },
    ],
  },
  {
    orderNumber: '#1006',
    customer: {
      name: 'Purvesh Pimple',
      email: 'purvesh9897@gmail.com',
      phone: '+91 97691 55359',
    },
    shippingAddress: {
      fullName: 'Purvesh Pimple',
      addressLine1: 'B-121, flat no.7, Goverment colony, near mahatma gandhi school',
      addressLine2: 'Bandra (east)',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      country: 'India',
      phone: '+91 97691 55359',
    },
    items: [
      {
        slug: 'kaddy-top-in-cotton',
        name: 'Sundown Linen Shorts',
        image: '/image1.jpg',
        price: 1254.66,
        quantity: 1,
        color: 'Brown',
        size: 'S',
        subtotal: 1254.66,
      },
    ],
    subtotal: 1254.66,
    shippingFee: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 1254.66,
    currency: 'INR',
    paymentStatus: 'refunded',
    paymentMethod: 'razorpay',
    channel: 'last-summer-shop<>Fastrr',
    paymentDetails: {
      transactionId: '29032373772',
      gateway: 'PayU / Fastrr',
      paymentDate: new Date('2026-06-12T13:01:00Z'),
      refundId: 'ref_992810482',
      refundReason: 'Order cancelled by customer',
      refundAmount: 1254.66,
    },
    fulfillmentStatus: 'cancelled',
    staffNotes: ['Refund processed directly back to PayU account on 23 June.'],
    timeline: [
      {
        title: 'Order archived',
        description: 'Order #1006 marked as archived',
        createdAt: new Date('2026-06-23T16:19:00Z'),
        actor: 'Admin',
      },
      {
        title: 'Refund processed ₹1,254.66',
        description: 'Refunded back to original payment method via PayU',
        createdAt: new Date('2026-06-23T16:19:00Z'),
        actor: 'Admin',
      },
      {
        title: 'Order canceled by staff',
        description: 'Reason: Customer cancellation request',
        createdAt: new Date('2026-06-23T16:19:00Z'),
        actor: 'Admin',
      },
      {
        title: 'Confirmation #AYGY2YDJT generated',
        description: 'Order confirmation email sent to purvesh9897@gmail.com',
        createdAt: new Date('2026-06-12T13:01:00Z'),
        actor: 'System',
      },
    ],
  },
];

export async function POST() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin role required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check existing count
    const existingCount = await Order.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Orders table already contains ${existingCount} orders. No re-seed needed.`,
      });
    }

    await Order.insertMany(SAMPLE_ORDERS);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${SAMPLE_ORDERS.length} sample orders!`,
    });
  } catch (error: unknown) {
    console.error('Error seeding orders:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to seed orders' },
      { status: 500 }
    );
  }
}
