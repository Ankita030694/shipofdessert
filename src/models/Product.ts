import mongoose, { Schema, Document, Model } from 'mongoose';

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
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  details?: string[];
  fabric?: string;
  care?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
    details: {
      type: [String],
      default: [],
    },
    fabric: {
      type: String,
      default: '100% Handloom Organic Cotton',
    },
    care: {
      type: String,
      default: 'Dry clean or gentle hand wash in cold water.',
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
