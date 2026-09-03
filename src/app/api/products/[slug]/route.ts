import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/products/[slug] - Retrieve single product details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const query: Record<string, unknown> = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug: slug.toLowerCase() }, { _id: slug }] }
      : { slug: slug.toLowerCase() };

    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: `Product with slug "${slug}" not found.` },
        { status: 404 }
      );
    }

    // Fetch related products in same category or collection
    const related = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { collectionName: product.collectionName }],
    })
      .limit(3)
      .lean();

    // Fetch "Complete the Set" items if specified
    let companionItems: Array<{ id: string; name: string; slug: string; price: number; image: string }> = [];
    if (product.completeTheSet && product.completeTheSet.length > 0) {
      const companions = await Product.find({
        $or: [
          { slug: { $in: product.completeTheSet } },
          { name: { $in: product.completeTheSet } },
        ],
      })
        .limit(4)
        .lean();

      companionItems = companions.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        price: c.price,
        image: c.images[0] || '/image1.jpg',
      }));
    }

    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency || 'INR',
      category: product.category,
      collectionName: product.collectionName,
      images: product.images,
      image: product.images[0] || '/image1.jpg',
      classifiedImages: product.classifiedImages || [],
      setPieces: product.setPieces || {
        isSet: product.category?.toLowerCase() === 'sets',
        topName: 'Top / Vest',
        topPrice: 0,
        bottomName: 'Skirt / Trouser',
        bottomPrice: 0,
      },
      colors: product.colors,
      sizes: product.sizes,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      featured: product.featured,

      // Rich Attributes
      rating: product.rating || 4.9,
      reviewsCount: product.reviewsCount || 18,
      fitNote: product.fitNote || 'Relaxed Fit · Model is 6\'0" and wears M',
      fitType: product.fitType || 'Relaxed Fit',
      modelStats: product.modelStats || 'Model is 6\'0" and wears M',
      fabric: product.fabric || '100% Handcrafted Organic Cotton. Breathable, textured natural drape.',
      fit: product.fit || 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
      designDetails: product.designDetails || product.details || [
        'Relaxed architectural silhouette',
        'Dropped shoulder seam detail',
        'Naturally breathable handwoven texture',
        'Concealed French seams for durability',
      ],
      details: product.details || [],
      care: product.care || 'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.',

      // Trust Signals
      estimatedDelivery: product.estimatedDelivery || '3–5 Business Days',
      codAvailable: product.codAvailable !== false,
      freeShipping: product.freeShipping !== false,
      easyReturns: product.easyReturns || '7-Day Complimentary Returns & Exchanges',

      // Companion pieces
      completeTheSet: product.completeTheSet || [],
      companionItems,

      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
      relatedProducts: related.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        slug: r.slug,
        price: r.price,
        image: r.images[0] || '/image1.jpg',
        colors: r.colors,
      })),
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (error: unknown) {
    console.error('API GET /api/products/[slug] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PATCH /api/products/[slug] - Update product details (Admin)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const body = await request.json();

    const query: Record<string, unknown> = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug: slug.toLowerCase() }, { _id: slug }] }
      : { slug: slug.toLowerCase() };

    if (body.designDetails && typeof body.designDetails === 'string') {
      body.designDetails = body.designDetails.split('\n').map((s: string) => s.trim()).filter(Boolean);
      body.details = body.designDetails;
    }

    if (body.completeTheSet && typeof body.completeTheSet === 'string') {
      body.completeTheSet = body.completeTheSet.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = await Product.findOneAndUpdate(query, body, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error: unknown) {
    console.error('API PATCH /api/products/[slug] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update product.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE /api/products/[slug] - Remove product (Admin)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const query: Record<string, unknown> = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug: slug.toLowerCase() }, { _id: slug }] }
      : { slug: slug.toLowerCase() };

    const deleted = await Product.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error: unknown) {
    console.error('API DELETE /api/products/[slug] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
