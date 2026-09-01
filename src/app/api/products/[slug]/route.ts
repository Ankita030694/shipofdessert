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

    const formattedProduct = {
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      category: product.category,
      collectionName: product.collectionName,
      images: product.images,
      image: product.images[0] || '/image1.jpg',
      colors: product.colors,
      sizes: product.sizes,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      featured: product.featured,
      fabric: product.fabric,
      care: product.care,
      details: product.details,
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
