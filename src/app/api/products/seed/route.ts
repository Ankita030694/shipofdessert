import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const INITIAL_PRODUCTS = [
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
    fabric: '100% Handcrafted Organic Cotton',
    care: 'Dry clean or gentle hand wash in cold water.',
    details: [
      'Relaxed architectural silhouette',
      'Dropped shoulder seam detail',
      'Naturally breathable handwoven texture',
      'Made ethically in our partner atelier'
    ]
  },
  {
    name: 'Kabira Top in Cotton',
    slug: 'kabira-top-in-cotton',
    description: 'Minimalist high-neck tunic top cut from breathable textured cotton. Tailored with clean edge finishing and discreet side slits.',
    price: 1750,
    currency: 'INR',
    category: 'Tops',
    collectionName: 'The Inheritance 01',
    images: ['/image2.jpg', '/image1.jpg', '/image4.jpg'],
    colors: ['White', 'Grey', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockQuantity: 30,
    featured: true,
    fabric: '100% Crisp Poplin Cotton',
    care: 'Machine wash cold on delicate cycle.',
    details: [
      'Subtle mock neckline',
      'Side split hem for fluid drape',
      'Minimal invisible rear closure'
    ]
  },
  {
    name: 'Stella Slipper in Leather',
    slug: 'stella-slipper-in-leather',
    description: 'Handcrafted artisan leather slipper featuring clean lines, a cushioned footbed, and enduring full-grain calfskin leather.',
    price: 920,
    currency: 'INR',
    category: 'Footwear',
    collectionName: 'Core Collection',
    images: ['/image3.jpg', '/image1.jpg'],
    colors: ['Black', 'Brown'],
    sizes: ['36', '37', '38', '39', '40', '41'],
    inStock: true,
    stockQuantity: 25,
    featured: true,
    fabric: '100% Full-Grain Vegetable Tanned Leather',
    care: 'Condition periodically with natural leather balm.',
    details: [
      'Ergonomic leather footbed',
      'Hand-stitched perimeter',
      'Slip-on ease with architectural profile'
    ]
  },
  {
    name: 'Alfidis Pant in Cotton',
    slug: 'alfidis-pant-in-cotton',
    description: 'Wide-leg tailored trouser shaped by considered proportions, deep pleats, and an elasticated back waistband for uncompromised comfort.',
    price: 1390,
    currency: 'INR',
    category: 'Pants',
    collectionName: 'The Inheritance 01',
    images: ['/image4.jpg', '/image2.jpg', '/image3.jpg'],
    colors: ['Brown', 'Charcoal', 'Sand'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: 35,
    featured: false,
    fabric: '100% Heavyweight Handloom Cotton Twill',
    care: 'Dry clean recommended.',
    details: [
      'Deep double front pleats',
      'Concealed horn button fastening',
      'Side seam slash pockets'
    ]
  },
  {
    name: 'Aura Silk Wrap Dress',
    slug: 'aura-silk-wrap-dress',
    description: 'A fluid wrap dress crafted from raw Mulberry silk with a self-tie waist sash and sculpted dolman sleeves.',
    price: 2450,
    compareAtPrice: 2800,
    currency: 'INR',
    category: 'Dresses',
    collectionName: 'The Inheritance 01',
    images: ['/image1.jpg', '/image3.jpg'],
    colors: ['Stone', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockQuantity: 20,
    featured: true,
    fabric: '100% Raw Mulberry Silk',
    care: 'Professional dry clean only.',
    details: [
      'Adjustable wrap silhouette',
      'Subtle kimono-inspired neckline',
      'Ankle-grazing length with graceful drape'
    ]
  },
  {
    name: 'Mirage Linen Pleated Skirt',
    slug: 'mirage-linen-pleated-skirt',
    description: 'An elongated midi skirt shaped by crisp inverted pleats in pure European washed linen.',
    price: 1890,
    currency: 'INR',
    category: 'Skirts',
    collectionName: 'The Inheritance 01',
    images: ['/image2.jpg', '/image4.jpg'],
    colors: ['Sand', 'Slate', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockQuantity: 28,
    featured: false,
    fabric: '100% Pure Washed Linen',
    care: 'Gentle hand wash in cold water.',
    details: [
      'High-rise waist with tailored waistband',
      'Invisible side zipper',
      'Generous movement and drape'
    ]
  }
];

export async function POST() {
  try {
    await connectToDatabase();

    // Check existing count
    const existingCount = await Product.countDocuments();
    
    // Upsert or insert initial products
    for (const prod of INITIAL_PRODUCTS) {
      await Product.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, returnDocument: 'after' }
      );
    }

    const totalCount = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded with KSHAUM products. Total products in database: ${totalCount}`,
      initialCount: existingCount,
      currentCount: totalCount,
    });
  } catch (error: unknown) {
    console.error('Products seed error:', error);
    const message = error instanceof Error ? error.message : 'Failed to seed products';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
