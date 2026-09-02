import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Cart, { ICartItem } from '@/models/Cart';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Helper to determine user identity (either session user or guest sessionId)
async function getCartIdentifier(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  const sessionId = request.headers.get('x-session-id') || request.nextUrl.searchParams.get('sessionId') || undefined;

  return { userId, sessionId };
}

// GET /api/cart - Fetch current user's or guest's cart
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, sessionId } = await getCartIdentifier(request);

    if (!userId && !sessionId) {
      return NextResponse.json({ success: true, data: { items: [], totalCount: 0, subtotal: 0 } });
    }

    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query).lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({
        success: true,
        data: { items: [], totalCount: 0, subtotal: 0 },
      });
    }

    const items = cart.items.map((item) => ({
      id: item._id ? item._id.toString() : `${item.slug}-${item.size}-${item.color}`,
      productId: item.productId?.toString(),
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: cart._id.toString(),
        items,
        totalCount,
        subtotal,
      },
    });
  } catch (error: unknown) {
    console.error('API GET /api/cart error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch cart';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart or merge guest items
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, sessionId } = await getCartIdentifier(request);
    const body = await request.json();

    const { productId, slug, name, image, price, color, size, quantity = 1, mergeItems } = body;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Cart owner identification required.' },
        { status: 400 }
      );
    }

    const query = userId ? { userId } : { sessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({ ...(userId ? { userId } : { sessionId }), items: [] });
    }

    // Check if user is sending a full guest migration array
    if (mergeItems && Array.isArray(mergeItems)) {
      for (const item of mergeItems) {
        const existingIndex = cart.items.findIndex(
          (i: ICartItem) =>
            i.slug === item.slug &&
            i.size?.toLowerCase() === (item.size || 'M').toLowerCase() &&
            i.color?.toLowerCase() === (item.color || 'Standard').toLowerCase()
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity += item.quantity || 1;
        } else {
          cart.items.push({
            productId: item.productId || item.slug,
            slug: item.slug,
            name: item.name,
            image: item.image || '/image1.jpg',
            price: Number(item.price),
            color: item.color || 'Standard',
            size: item.size || 'M',
            quantity: Number(item.quantity) || 1,
          });
        }
      }

      await cart.save();

      const items = cart.items.map((item: ICartItem) => ({
        id: item._id ? item._id.toString() : `${item.slug}-${item.size}-${item.color}`,
        productId: item.productId?.toString(),
        slug: item.slug,
        name: item.name,
        image: item.image,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }));

      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return NextResponse.json({
        success: true,
        message: 'Cart merged successfully.',
        data: { id: cart._id.toString(), items, totalCount, subtotal },
      });
    }

    // Standard Single Item Add
    if (!slug || !name || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing product details (slug, name, price).' },
        { status: 400 }
      );
    }

    const targetSize = size || 'M';
    const targetColor = color || 'Standard';

    const existingIndex = cart.items.findIndex(
      (i: ICartItem) =>
        i.slug === slug &&
        i.size?.toLowerCase() === targetSize.toLowerCase() &&
        i.color?.toLowerCase() === targetColor.toLowerCase()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({
        productId: productId || slug,
        slug,
        name,
        image: image || '/image1.jpg',
        price: Number(price),
        color: targetColor,
        size: targetSize,
        quantity: Number(quantity) || 1,
      });
    }

    await cart.save();

    const items = cart.items.map((item: ICartItem) => ({
      id: item._id ? item._id.toString() : `${item.slug}-${item.size}-${item.color}`,
      productId: item.productId?.toString(),
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: 'Item added to shopping bag.',
      data: {
        id: cart._id.toString(),
        items,
        totalCount,
        subtotal,
      },
    });
  } catch (error: unknown) {
    console.error('API POST /api/cart error:', error);
    const message = error instanceof Error ? error.message : 'Failed to add item to cart';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, sessionId } = await getCartIdentifier(request);
    const body = await request.json();
    const { itemId, slug, size, color, quantity } = body;

    if (!userId && !sessionId) {
      return NextResponse.json({ success: false, message: 'Cart identification required.' }, { status: 400 });
    }

    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return NextResponse.json({ success: false, message: 'Cart not found.' }, { status: 404 });
    }

    const newQty = Number(quantity);

    if (newQty <= 0) {
      // Remove item
      cart.items = cart.items.filter((i: ICartItem) => {
        if (itemId && i._id?.toString() === itemId) return false;
        if (itemId && `${i.slug}-${i.size}-${i.color}`.toLowerCase() === itemId.toLowerCase()) return false;
        if (slug && i.slug === slug && i.size?.toLowerCase() === size?.toLowerCase() && i.color?.toLowerCase() === color?.toLowerCase()) return false;
        return true;
      });
    } else {
      // Update quantity
      const item = cart.items.find((i: ICartItem) => {
        if (itemId && i._id?.toString() === itemId) return true;
        if (itemId && `${i.slug}-${i.size}-${i.color}`.toLowerCase() === itemId.toLowerCase()) return true;
        if (slug && i.slug === slug && i.size?.toLowerCase() === size?.toLowerCase() && i.color?.toLowerCase() === color?.toLowerCase()) return true;
        return false;
      });

      if (item) {
        item.quantity = newQty;
      }
    }

    await cart.save();

    const items = cart.items.map((item: ICartItem) => ({
      id: item._id ? item._id.toString() : `${item.slug}-${item.size}-${item.color}`,
      productId: item.productId?.toString(),
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: 'Cart updated.',
      data: {
        id: cart._id.toString(),
        items,
        totalCount,
        subtotal,
      },
    });
  } catch (error: unknown) {
    console.error('API PATCH /api/cart error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update cart';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE /api/cart - Remove specific item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, sessionId } = await getCartIdentifier(request);
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (!userId && !sessionId) {
      return NextResponse.json({ success: true, data: { items: [], totalCount: 0, subtotal: 0 } });
    }

    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [], totalCount: 0, subtotal: 0 } });
    }

    if (clearAll) {
      cart.items = [];
    } else if (itemId) {
      cart.items = cart.items.filter((i: ICartItem) => {
        const matchesMongoId = i._id?.toString() === itemId;
        const matchesComposite = `${i.slug}-${i.size}-${i.color}`.toLowerCase() === itemId.toLowerCase();
        return !matchesMongoId && !matchesComposite;
      });
    }

    await cart.save();

    const items = cart.items.map((item: ICartItem) => ({
      id: item._id ? item._id.toString() : `${item.slug}-${item.size}-${item.color}`,
      productId: item.productId?.toString(),
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.price,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: clearAll ? 'Cart cleared.' : 'Item removed.',
      data: {
        id: cart._id.toString(),
        items,
        totalCount,
        subtotal,
      },
    });
  } catch (error: unknown) {
    console.error('API DELETE /api/cart error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete from cart';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
