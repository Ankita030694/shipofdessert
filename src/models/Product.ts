import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClassifiedImage {
  url: string;
  tag: 'full_set' | 'top' | 'bottom' | 'detail' | 'general';
  caption?: string;
  sortOrder?: number;
}

export interface ISetPieces {
  isSet: boolean;
  topName?: string;
  topPrice?: number;
  bottomName?: string;
  bottomPrice?: number;
  additionalName?: string;
  additionalPrice?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  collectionName: string;
  images: string[];
  classifiedImages?: IClassifiedImage[];
  setPieces?: ISetPieces;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  
  // Rich Attributes
  rating: number;
  reviewsCount: number;
  fitNote?: string;
  fitType?: string;
  modelStats?: string;
  fabric?: string;
  fit?: string;
  designDetails?: string[];
  details?: string[];
  care?: string;
  
  // Trust Signals
  estimatedDelivery?: string;
  codAvailable: boolean;
  freeShipping: boolean;
  easyReturns?: string;
  
  // Companion / Cross-sell
  completeTheSet?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const ClassifiedImageSchema = new Schema<IClassifiedImage>(
  {
    url: { type: String, required: true },
    tag: {
      type: String,
      enum: ['full_set', 'top', 'bottom', 'detail', 'general'],
      default: 'general',
    },
    caption: { type: String },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const SetPiecesSchema = new Schema<ISetPieces>(
  {
    isSet: { type: Boolean, default: false },
    topName: { type: String, default: 'Top / Vest' },
    topPrice: { type: Number, default: 0 },
    bottomName: { type: String, default: 'Skirt / Trouser' },
    bottomPrice: { type: Number, default: 0 },
    additionalName: { type: String },
    additionalPrice: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true,
    },
    collectionName: {
      type: String,
      default: 'The Inheritance 01',
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      default: ['/image1.jpg'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Product must have at least one image',
      },
    },
    classifiedImages: {
      type: [ClassifiedImageSchema],
      default: [],
    },
    setPieces: {
      type: SetPiecesSchema,
      default: () => ({ isSet: false }),
    },
    colors: {
      type: [String],
      default: ['Black'],
    },
    sizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 50,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Rich Attributes
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 18,
      min: 0,
    },
    fitNote: {
      type: String,
      default: 'Relaxed Fit · Model is 6\'0" and wears M',
      trim: true,
    },
    fitType: {
      type: String,
      default: 'Relaxed Fit',
      trim: true,
    },
    modelStats: {
      type: String,
      default: 'Model is 6\'0" and wears M',
      trim: true,
    },
    fabric: {
      type: String,
      default: '100% Handcrafted Organic Cotton. Breathable, textured natural drape.',
      trim: true,
    },
    fit: {
      type: String,
      default: 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
      trim: true,
    },
    designDetails: {
      type: [String],
      default: [
        'Relaxed architectural silhouette',
        'Dropped shoulder seam detail',
        'Naturally breathable handwoven texture',
        'Concealed French seams for durability',
      ],
    },
    details: {
      type: [String],
      default: [],
    },
    care: {
      type: String,
      default: 'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.',
      trim: true,
    },

    // Trust Signals
    estimatedDelivery: {
      type: String,
      default: '3–5 Business Days',
      trim: true,
    },
    codAvailable: {
      type: Boolean,
      default: true,
    },
    freeShipping: {
      type: Boolean,
      default: true,
    },
    easyReturns: {
      type: String,
      default: '7-Day Complimentary Returns & Exchanges',
      trim: true,
    },

    // Companion pieces
    completeTheSet: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug helper
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
