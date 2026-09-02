import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

const INITIAL_PRODUCTS = [
  {
    name: 'Kaddy Top in Cotton',
    slug: 'kaddy-top-in-cotton',
    description: 'A relaxed, architectural silhouette designed with refined dropped shoulders and structured pure cotton weave. An understated essential designed for everyday elegance.',
    price: 1650,
    compareAtPrice: 1950,
    currency: 'INR',
    category: 'Tops',
    collectionName: 'The Inheritance 01',
    images: ['/image1.jpg', '/image2.jpg', '/image3.jpg', '/image4.jpg'],
    colors: ['Black', 'Grey', 'Stone'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 45,
    featured: true,
    rating: 4.9,
    reviewsCount: 24,
    fitNote: 'Relaxed Fit · Model is 6\'0" and wears M',
    fitType: 'Relaxed Fit',
    modelStats: 'Model is 6\'0" (183cm) and wears size M',
    fabric: '100% Handcrafted Organic Cotton. Breathable, medium-weight textured natural drape.',
    fit: 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
    designDetails: [
      'Relaxed architectural silhouette',
      'Dropped shoulder seam detail',
      'Naturally breathable handwoven texture',
      'Concealed French seams for durability',
      'Made ethically in our partner atelier in Rajasthan',
    ],
    care: 'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.',
    estimatedDelivery: '3–5 Business Days',
    codAvailable: true,
    freeShipping: true,
    easyReturns: '7-Day Complimentary Returns & Exchanges',
    completeTheSet: ['alfidis-pant-in-cotton', 'stella-slipper-in-leather'],
  },
  {
    name: 'Kabira Top in Cotton',
    slug: 'kabira-top-in-cotton',
    description: 'Minimalist high-neck tunic top cut from breathable textured cotton. Tailored with clean edge finishing and discreet side slits.',
    price: 1750,
    compareAtPrice: 2100,
    currency: 'INR',
    category: 'Tops',
    collectionName: 'The Inheritance 01',
    images: ['/image2.jpg', '/image1.jpg', '/image4.jpg'],
    colors: ['White', 'Off-White', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 30,
    featured: true,
    rating: 4.8,
    reviewsCount: 16,
    fitNote: 'Straight Cut · Model is 5\'10" and wears S',
    fitType: 'Straight Cut',
    modelStats: 'Model is 5\'10" (178cm) and wears size S',
    fabric: '100% Crisp Poplin Cotton. Pre-washed for soft handfeel.',
    fit: 'Straight fit with side split hem for fluid drape.',
    designDetails: [
      'Subtle mock neckline',
      'Side split hem for fluid drape',
      'Minimal invisible rear closure',
      'Reinforced bar-tack stitching',
    ],
    care: 'Machine wash cold on delicate cycle. Warm iron inside out.',
    estimatedDelivery: '3–5 Business Days',
    codAvailable: true,
    freeShipping: true,
    easyReturns: '7-Day Complimentary Returns & Exchanges',
    completeTheSet: ['alfidis-pant-in-cotton'],
  },
  {
    name: 'Stella Slipper in Leather',
    slug: 'stella-slipper-in-leather',
    description: 'Handcrafted artisan leather slipper featuring clean lines, a cushioned footbed, and enduring full-grain calfskin leather.',
    price: 920,
    compareAtPrice: 1200,
    currency: 'INR',
    category: 'Footwear',
    collectionName: 'Core Collection',
    images: ['/image3.jpg', '/image1.jpg'],
    colors: ['Black', 'Tan', 'Dark Brown'],
    sizes: ['38', '39', '40', '41', '42'],
    inStock: true,
    stockQuantity: 20,
    featured: false,
    rating: 5.0,
    reviewsCount: 31,
    fitNote: 'True to Size · If between sizes, size up',
    fitType: 'Standard Width',
    modelStats: 'Fits true to European size standards',
    fabric: '100% Full-grain Vegetable Tanned Calfskin Leather with natural leather sole.',
    fit: 'Ergonomic footbed that molds to your feet over time.',
    designDetails: [
      'Hand-stitched leather sole welt',
      'Ergonomic cushioned arch support',
      'Natural vegetable tanning process',
    ],
    care: 'Condition periodically with specialized leather balm. Avoid direct water immersion.',
    estimatedDelivery: '2–4 Business Days',
    codAvailable: true,
    freeShipping: true,
    easyReturns: '7-Day Complimentary Returns & Exchanges',
    completeTheSet: ['kaddy-top-in-cotton'],
  },
  {
    name: 'Alfidis Pant in Cotton',
    slug: 'alfidis-pant-in-cotton',
    description: 'Wide-leg trousers with front pleating, elasticated back waistband, and side-seam pockets. Cut from mid-weight natural cotton drill.',
    price: 1390,
    compareAtPrice: 1650,
    currency: 'INR',
    category: 'Pants',
    collectionName: 'The Inheritance 01',
    images: ['/image4.jpg', '/image2.jpg'],
    colors: ['Brown', 'Ecru', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 35,
    featured: true,
    rating: 4.9,
    reviewsCount: 19,
    fitNote: 'Relaxed Wide-Leg · High Rise · Model is 6\'0" and wears M',
    fitType: 'Relaxed Wide-Leg',
    modelStats: 'Model is 6\'0" (183cm) and wears size M',
    fabric: '100% Mid-weight Cotton Twill. Structured yet soft.',
    fit: 'High-rise with relaxed wide leg and tailored deep front pleats.',
    designDetails: [
      'High-waisted silhouette with elasticated rear waistband',
      'Deep dual front knife pleats',
      'Generous side seam pockets and rear welt pocket',
    ],
    care: 'Machine wash cold with similar colors. Line dry in shade.',
    estimatedDelivery: '3–5 Business Days',
    codAvailable: true,
    freeShipping: true,
    easyReturns: '7-Day Complimentary Returns & Exchanges',
    completeTheSet: ['kaddy-top-in-cotton', 'stella-slipper-in-leather'],
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      // Upsert seed products to update attributes
      for (const p of INITIAL_PRODUCTS) {
        await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
      }
      return NextResponse.json({
        success: true,
        message: `Catalog updated (${INITIAL_PRODUCTS.length} seed products updated with rich attributes).`,
      });
    }

    // Insert initial catalog
    await Product.insertMany(INITIAL_PRODUCTS);

    return NextResponse.json({
      success: true,
      message: `Catalogue seeded with ${INITIAL_PRODUCTS.length} products.`,
    });
  } catch (error: unknown) {
    console.error('Seed API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to seed products';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
