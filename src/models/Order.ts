import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOrderItem {
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  subtotal: number;
}

export interface IOrderTimelineEvent {
  title: string;
  description?: string;
  createdAt: Date;
  actor?: string;
}

export interface IOrder extends Document {
  orderNumber: string; // e.g. "#1024"
  customer: {
    name: string;
    email: string;
    phone?: string;
    userId?: string;
  };
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone?: string;
  };
  items: IOrderItem[];
  
  // Financials
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  currency: string;
  
  // Payment Lifecycle
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'refunded' | 'failed';
  paymentMethod: 'razorpay' | 'cod' | 'card' | 'upi' | 'netbanking' | 'manual';
  channel: string; // e.g. "Online Store", "Gokwik", "Fastrr"
  paymentDetails?: {
    transactionId?: string;
    gateway?: string;
    paymentDate?: Date;
    refundId?: string;
    refundReason?: string;
    refundAmount?: number;
  };
  
  // Fulfillment Lifecycle
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'in_transit' | 'delivered' | 'cancelled';
  fulfillmentDetails?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedDate?: Date;
    deliveredDate?: Date;
  };

  // Notes & Staff Comments
  customerNotes?: string;
  staffNotes?: string[];
  timeline: IOrderTimelineEvent[];

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '/image1.jpg' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String, default: 'Standard' },
    size: { type: String, default: 'M' },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const TimelineEventSchema = new Schema<IOrderTimelineEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    actor: { type: String, default: 'System' },
  },
  { _id: false }
);

const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String },
      userId: { type: String },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
      phone: { type: String },
    },
    billingAddress: {
      fullName: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' },
      phone: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'partially_paid', 'refunded', 'failed'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'card', 'upi', 'netbanking', 'manual'],
      default: 'cod',
    },
    channel: { type: String, default: 'Online Store' },
    paymentDetails: {
      transactionId: { type: String },
      gateway: { type: String },
      paymentDate: { type: Date },
      refundId: { type: String },
      refundReason: { type: String },
      refundAmount: { type: Number },
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'fulfilled', 'in_transit', 'delivered', 'cancelled'],
      default: 'unfulfilled',
      index: true,
    },
    fulfillmentDetails: {
      courierName: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      shippedDate: { type: Date },
      deliveredDate: { type: Date },
    },
    customerNotes: { type: String },
    staffNotes: [{ type: String }],
    timeline: [TimelineEventSchema],
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });
OrderSchema.index({ fulfillmentStatus: 1, createdAt: -1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
