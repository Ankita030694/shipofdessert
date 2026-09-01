import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import { auth } from '@/auth';

// Helper to check admin authorization
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return false;
  }
  return true;
}

// GET /api/admin/users - Retrieve all registered users / signed-up leads
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search')?.trim();

    const query: Record<string, unknown> = {};

    if (role && ['customer', 'admin'].includes(role)) {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const users = await User.find(query)
      .select('-password') // Exclude password hashes
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Valued Member',
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email,
      role: u.role || 'customer',
      phone: u.phone || '',
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers,
    });
  } catch (error: unknown) {
    console.error('API GET /api/admin/users error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch registered users';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user role
export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { success: false, message: 'User ID and role are required.' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['customer', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role value.' },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: 'after' }
    )
      .select('-password')
      .lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully.',
      data: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('API PATCH /api/admin/users error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error: unknown) {
    console.error('API DELETE /api/admin/users error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
