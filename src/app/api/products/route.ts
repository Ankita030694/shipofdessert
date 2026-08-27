import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product, { generateSlug } from '@/models/Product';

// GET /api/products - List products with rich filtering, searching, sorting & pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const collectionName = searchParams.get('collection');
    const featured = searchParams.get('featured');
    const inStockOnly = searchParams.get('inStock');
    const search = searchParams.get('search')?.trim();
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (collectionName) {
      query.collectionName = { $regex: new RegExp(collectionName, 'i') };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (inStockOnly === 'true') {
      query.inStock = true;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { collectionName: regex },
        { colors: regex },
      ];
    }

    // Sort order
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name_asc') {
      sortOptions = { name: 1 };
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const formatted = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      currency: p.currency,
      category: p.category,
      collectionName: p.collectionName,
      images: p.images,
      image: p.images[0] || '/image1.jpg',
      colors: p.colors,
      sizes: p.sizes,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity,
      featured: p.featured,
      fabric: p.fabric,
      care: p.care,
      details: p.details,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: formatted,
    });
  } catch (error: unknown) {
    console.error('API GET /api/products error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST /api/products - Create a new product (Admin)
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, price, description, category, collectionName, images, colors, sizes } = body;

    if (!name || price === undefined || !description || !category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, description, and category are required.' },
        { status: 400 }
      );
    }

    const slug = body.slug ? body.slug.toLowerCase().trim() : generateSlug(name);

    // Check for existing slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Product with slug "${slug}" already exists.` },
        { status: 409 }
      );
    }

    const newProduct = await Product.create({
      name: name.trim(),
      slug,
      description: description.trim(),
      price: Number(price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      currency: body.currency || 'INR',
      category: category.trim(),
      collectionName: collectionName || 'The Inheritance 01',
      images: Array.isArray(images) && images.length > 0 ? images : ['/image1.jpg'],
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Black'],
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL'],
      inStock: body.inStock !== false,
      stockQuantity: body.stockQuantity !== undefined ? Number(body.stockQuantity) : 50,
      featured: Boolean(body.featured),
      fabric: body.fabric || '100% Handcrafted Organic Cotton',
      care: body.care || 'Dry clean or gentle hand wash.',
      details: Array.isArray(body.details) ? body.details : [],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully.',
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('API POST /api/products error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create product.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
