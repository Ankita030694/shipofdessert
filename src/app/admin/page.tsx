'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export interface RegisteredUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  collectionName: string;
  images: string[];
  image: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  fabric?: string;
  care?: string;
  details?: string[];
  createdAt: string;
}

const CATEGORIES = ['Tops', 'Dresses', 'Skirts', 'Pants', 'Footwear', 'Accessories'];
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  // Registered Users State
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [userUpdatingId, setUserUpdatingId] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productActionId, setProductActionId] = useState<string | null>(null);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    price: '',
    compareAtPrice: '',
    category: 'Tops',
    collectionName: 'The Inheritance 01',
    description: '',
    images: ['/image1.jpg'],
    colorsStr: 'Black, Grey',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockQuantity: '50',
    featured: false,
    fabric: '100% Handcrafted Organic Cotton',
    care: 'Dry clean or gentle hand wash in cold water.',
  });

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (session?.user?.role !== 'admin') return;
    try {
      setUsersLoading(true);
      setUsersError(null);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch registered users');
      setUsers(data.data || []);
    } catch (err: unknown) {
      setUsersError(err instanceof Error ? err.message : 'Error fetching registered users');
    } finally {
      setUsersLoading(false);
    }
  }, [session?.user?.role]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    if (session?.user?.role !== 'admin') return;
    try {
      setProductsLoading(true);
      setProductsError(null);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
      setProducts(data.data || []);
    } catch (err: unknown) {
      setProductsError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setProductsLoading(false);
    }
  }, [session?.user?.role]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
      fetchProducts();
    }
  }, [fetchUsers, fetchProducts, session?.user?.role]);

  // User Role Change
  const handleUserRoleChange = async (id: string, newRole: 'customer' | 'admin') => {
    try {
      setUserUpdatingId(id);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user role');
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setUserUpdatingId(null);
    }
  };

  // User Delete
  const handleUserDelete = async (id: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    try {
      setUserUpdatingId(id);
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setUserUpdatingId(null);
    }
  };

  // Open Add Product Modal
  const openAddProductModal = () => {
    setEditingProduct(null);
    setManualImageUrl('');
    setProductForm({
      name: '',
      slug: '',
      price: '',
      compareAtPrice: '',
      category: 'Tops',
      collectionName: 'The Inheritance 01',
      description: '',
      images: ['/image1.jpg'],
      colorsStr: 'Black, Grey',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      inStock: true,
      stockQuantity: '50',
      featured: false,
      fabric: '100% Handcrafted Organic Cotton',
      care: 'Dry clean or gentle hand wash in cold water.',
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditProductModal = (product: ProductItem) => {
    setEditingProduct(product);
    setManualImageUrl('');
    setProductForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
      category: product.category,
      collectionName: product.collectionName,
      description: product.description,
      images: product.images && product.images.length > 0 ? product.images : [product.image || '/image1.jpg'],
      colorsStr: product.colors ? product.colors.join(', ') : 'Black',
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL'],
      inStock: product.inStock,
      stockQuantity: product.stockQuantity.toString(),
      featured: product.featured,
      fabric: product.fabric || '100% Handcrafted Organic Cotton',
      care: product.care || 'Dry clean or gentle hand wash in cold water.',
    });
    setIsProductModalOpen(true);
  };

  // Helper to compress and convert file to Base64 data URL
  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 1600;
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Photo Upload (Convert to Base64)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const base64Url = await compressAndConvertToBase64(file);

      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, base64Url],
      }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error converting image to Base64');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Manual Image URL
  const handleAddManualImage = () => {
    const url = manualImageUrl.trim();
    if (!url) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setManualImageUrl('');
  };

  // Remove Image from Product
  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated.length > 0 ? updated : ['/image1.jpg'],
      };
    });
  };

  // Make Image Primary (Move to Index 0)
  const handleMakeImagePrimary = (indexToPrimary: number) => {
    setProductForm((prev) => {
      const selected = prev.images[indexToPrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return {
        ...prev,
        images: [selected, ...rest],
      };
    });
  };

  // Save Product (Add or Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert('Please fill in Name, Price, and Description.');
      return;
    }

    if (productForm.images.length === 0) {
      alert('Please include at least one garment image.');
      return;
    }

    setProductSubmitting(true);

    try {
      const colors = productForm.colorsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: productForm.name.trim(),
        slug: productForm.slug.trim(),
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : null,
        category: productForm.category,
        collectionName: productForm.collectionName,
        description: productForm.description.trim(),
        images: productForm.images,
        colors: colors.length > 0 ? colors : ['Black'],
        sizes: productForm.sizes,
        inStock: productForm.inStock,
        stockQuantity: parseInt(productForm.stockQuantity || '50', 10),
        featured: productForm.featured,
        fabric: productForm.fabric,
        care: productForm.care,
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update product');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create product');
      }

      setIsProductModalOpen(false);
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setProductSubmitting(false);
    }
  };

  // Delete Product
  const handleProductDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      setProductActionId(slug);
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setProductActionId(null);
    }
  };

  // Seed Product Catalog shortcut
  const handleSeedCatalog = async () => {
    if (!confirm('This will seed the database with KSHAUM catalogue items. Continue?')) return;
    try {
      setProductsLoading(true);
      const res = await fetch('/api/products/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to seed');
      alert(data.message);
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to seed catalogue');
    } finally {
      setProductsLoading(false);
    }
  };

  // Export Registered Users to CSV
  const exportUsersToCSV = () => {
    if (users.length === 0) {
      alert('No registered users available to export.');
      return;
    }
    const headers = ['ID', 'Date Joined', 'Name', 'Email', 'Role', 'Phone'];
    const rows = users.map((u) => [
      `"${u.id}"`,
      `"${new Date(u.createdAt).toLocaleString()}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.role}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kshaum-members-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Computed Users List
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
      const q = userSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone && user.phone.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  // Computed Products List
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        productCategoryFilter === 'All' ||
        prod.category.toLowerCase() === productCategoryFilter.toLowerCase();
      const q = productSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.slug.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        prod.collectionName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearchQuery]);

  // Summary Metrics
  const userStats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter((u) => u.role === 'customer').length,
      admins: users.filter((u) => u.role === 'admin').length,
    };
  }, [users]);

  const productStats = useMemo(() => {
    return {
      total: products.length,
      inStock: products.filter((p) => p.inStock).length,
      featured: products.filter((p) => p.featured).length,
      categoriesCount: Array.from(new Set(products.map((p) => p.category))).length,
    };
  }, [products]);

  // ---------------------------------------------------------------------------
  // AUTHENTICATION & AUTHORIZATION GUARDS
  // ---------------------------------------------------------------------------

  // 1. Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] text-[#1c1c1a] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="font-serif tracking-[0.3em] uppercase text-sm font-semibold text-[#1c1c1a]">
            KSHAUM
          </div>
          <div className="text-xs uppercase tracking-widest text-[#1c1c1a]/60 animate-pulse">
            Verifying Administrator Credentials...
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate (Not Logged In)
  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] text-[#1c1c1a] flex flex-col items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 sm:p-10 rounded-sm border border-[#1c1c1a]/15 shadow-xl text-center space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-bold block mb-2">
              Security Gate
            </span>
            <h1 className="text-xl font-serif uppercase tracking-wider text-[#1c1c1a]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#1c1c1a]/70 mt-3 leading-relaxed">
              Please sign in with your verified administrator account to access the catalogue and member management.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login?callbackUrl=/admin"
              className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors"
            >
              Sign In to Admin Portal
            </Link>
            <Link
              href="/"
              className="block w-full border border-[#1c1c1a]/20 text-[#1c1c1a] py-3 text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Gate (Logged In as Customer, Not Admin)
  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] text-[#1c1c1a] flex flex-col items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 sm:p-10 rounded-sm border border-amber-300 shadow-xl text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl border border-amber-200">
            🔒
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-800 font-bold block mb-1">
              Access Restricted
            </span>
            <h1 className="text-lg font-serif uppercase tracking-wider text-[#1c1c1a]">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-[#1c1c1a]/70 mt-3 leading-relaxed">
              You are signed in as <strong className="text-[#1c1c1a]">{session.user.email}</strong> (Account Level: <em>Customer</em>). This area is strictly reserved for KSHAUM staff.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signOut({ callbackUrl: '/login?callbackUrl=/admin' })}
              className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors cursor-pointer"
            >
              Sign In with Admin Account
            </button>
            <Link
              href="/"
              className="block w-full border border-[#1c1c1a]/20 text-[#1c1c1a] py-3 text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. Authenticated Admin Dashboard
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1c1c1a] font-sans antialiased">
      {/* Top Navbar */}
      <header className="border-b border-[#1c1c1a]/10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="font-serif text-lg tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity"
            >
              KSHAUM
            </Link>
            <span className="text-xs uppercase tracking-widest text-[#bdb2a1] border-l border-[#1c1c1a]/20 pl-4">
              Admin Portal
            </span>
          </div>

          {/* Admin Identity & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#1c1c1a]/15 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#1c1c1a]/70">Admin:</span>
              <strong className="text-[#1c1c1a]">{session.user.name || session.user.email}</strong>
            </div>

            {activeTab === 'products' ? (
              <>
                <button
                  onClick={fetchProducts}
                  disabled={productsLoading}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {productsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={openAddProductModal}
                  className="text-xs uppercase tracking-widest px-3.5 py-1.5 bg-[#1c1c1a] text-white hover:bg-[#333330] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ Add Product</span>
                </button>
                <Link
                  href="/collection"
                  target="_blank"
                  className="text-xs uppercase tracking-widest px-3 py-1.5 border border-transparent text-[#1c1c1a]/70 hover:text-[#1c1c1a] transition-all"
                >
                  View Store ↗
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={fetchUsers}
                  disabled={usersLoading}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {usersLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={exportUsersToCSV}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 bg-[#1c1c1a] text-white hover:bg-[#333330] transition-all cursor-pointer"
                >
                  Export CSV
                </button>
              </>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs uppercase tracking-widest px-3 py-1.5 text-stone-500 hover:text-red-700 transition-colors cursor-pointer"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Tabs Navigation */}
        <div className="flex border-b border-[#1c1c1a]/15 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#1c1c1a] text-[#1c1c1a]'
                : 'border-transparent text-[#1c1c1a]/50 hover:text-[#1c1c1a]'
            }`}
          >
            <span>🛍️ Products & Inventory</span>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded-full font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-[#1c1c1a] text-[#1c1c1a]'
                : 'border-transparent text-[#1c1c1a]/50 hover:text-[#1c1c1a]'
            }`}
          >
            <span>👥 Signed-Up Users</span>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded-full font-bold">
              {users.length}
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PRODUCTS & INVENTORY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div>
            {/* Products KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1a]/60">
                  Total Products
                </span>
                <div className="text-2xl font-serif mt-2 text-[#1c1c1a]">{productStats.total}</div>
              </div>
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  In Stock
                </span>
                <div className="text-2xl font-serif mt-2 text-emerald-900">
                  {productStats.inStock}
                </div>
              </div>
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                  Featured Items
                </span>
                <div className="text-2xl font-serif mt-2 text-purple-900">
                  {productStats.featured}
                </div>
              </div>
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1a]/60">
                  Categories
                </span>
                <div className="text-2xl font-serif mt-2 text-[#1c1c1a]">
                  {productStats.categoriesCount}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-sm border border-[#1c1c1a]/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                      productCategoryFilter === cat
                        ? 'bg-[#1c1c1a] text-white'
                        : 'bg-[#f9f9f9] border border-[#1c1c1a]/15 text-[#1c1c1a]/70 hover:text-[#1c1c1a]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products by title, slug, collection..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#f9f9f9] border border-[#1c1c1a]/15 px-3 py-2 rounded-sm focus:outline-none focus:border-[#1c1c1a]"
                />
                {productSearchQuery && (
                  <button
                    onClick={() => setProductSearchQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-sm border border-[#1c1c1a]/10 overflow-hidden shadow-xs">
              {productsLoading && products.length === 0 ? (
                <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
                  Loading catalogue from MongoDB...
                </div>
              ) : productsError ? (
                <div className="py-12 text-center text-sm text-red-600">
                  {productsError}
                  <div className="mt-2">
                    <button
                      onClick={fetchProducts}
                      className="text-xs uppercase underline tracking-wider cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-[#1c1c1a]/60 font-light">
                    {productSearchQuery || productCategoryFilter !== 'All'
                      ? 'No products matching your search criteria.'
                      : 'No products in database yet.'}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={openAddProductModal}
                      className="px-4 py-2 bg-[#1c1c1a] text-white text-xs uppercase tracking-wider cursor-pointer hover:bg-[#333330]"
                    >
                      + Add First Product
                    </button>
                    <button
                      onClick={handleSeedCatalog}
                      className="px-4 py-2 border border-[#1c1c1a]/20 text-xs uppercase tracking-wider cursor-pointer hover:bg-stone-100"
                    >
                      Seed KSHAUM Catalog
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9f9f9] border-b border-[#1c1c1a]/10 uppercase tracking-widest text-[#1c1c1a]/70 text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Collection</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Colors & Sizes</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1a]/5">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#faf9f6] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-14 bg-[#e8e4dc]/40 rounded-xs overflow-hidden flex-shrink-0">
                                <Image
                                  src={prod.image || '/image1.jpg'}
                                  alt={prod.name}
                                  fill
                                  unoptimized={Boolean(prod.image?.startsWith('data:'))}
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-[#1c1c1a]">{prod.name}</div>
                                <div className="text-[10px] text-[#1c1c1a]/50 font-mono">
                                  /{prod.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/80">
                            {prod.category}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/70 text-[11px]">
                            {prod.collectionName}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-[#1c1c1a]">
                              ₹{prod.price.toLocaleString()}
                            </div>
                            {prod.compareAtPrice && (
                              <div className="text-[10px] text-stone-400 line-through">
                                ₹{prod.compareAtPrice.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-xs border font-medium ${
                                prod.inStock
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-red-50 border-red-300 text-red-800'
                              }`}
                            >
                              {prod.inStock ? `In Stock (${prod.stockQuantity})` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {prod.colors?.map((c, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-stone-100 px-1.5 py-0.2 rounded-xs border border-stone-200"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                            <Link
                              href={`/product/${prod.slug}`}
                              target="_blank"
                              className="inline-block px-2 py-1 text-[11px] border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-colors uppercase tracking-wider"
                            >
                              View ↗
                            </Link>
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="inline-block px-2.5 py-1 text-[11px] bg-[#1c1c1a] text-white hover:bg-[#333330] transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleProductDelete(prod.slug, prod.name)}
                              disabled={productActionId === prod.slug}
                              className="inline-block px-2 py-1 text-[11px] border border-red-200 text-red-700 hover:bg-red-700 hover:text-white transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-50"
                            >
                              {productActionId === prod.slug ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REGISTERED USERS & SIGNED-UP LEADS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1a]/60">
                  Total Registered Members
                </span>
                <div className="text-2xl font-serif mt-2 text-[#1c1c1a]">{userStats.total}</div>
              </div>
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Customer Accounts
                </span>
                <div className="text-2xl font-serif mt-2 text-blue-900">{userStats.customers}</div>
              </div>
              <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Admin Accounts
                </span>
                <div className="text-2xl font-serif mt-2 text-amber-900">{userStats.admins}</div>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-sm border border-[#1c1c1a]/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex space-x-1 border border-[#1c1c1a]/15 p-1 rounded-sm bg-[#f9f9f9]">
                {(['all', 'customer', 'admin'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setUserRoleFilter(tab)}
                    className={`px-3 py-1 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                      userRoleFilter === tab
                        ? 'bg-[#1c1c1a] text-white'
                        : 'text-[#1c1c1a]/70 hover:text-[#1c1c1a]'
                    }`}
                  >
                    {tab === 'all' ? 'All Members' : tab === 'customer' ? 'Customers' : 'Admins'}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search registered members by name, email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#f9f9f9] border border-[#1c1c1a]/15 px-3 py-2 rounded-sm focus:outline-none focus:border-[#1c1c1a]"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-sm border border-[#1c1c1a]/10 overflow-hidden shadow-xs">
              {usersLoading && users.length === 0 ? (
                <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
                  Loading registered members from MongoDB...
                </div>
              ) : usersError ? (
                <div className="py-12 text-center text-sm text-red-600">
                  {usersError}
                  <div className="mt-2">
                    <button
                      onClick={fetchUsers}
                      className="text-xs uppercase underline tracking-wider cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-[#1c1c1a]/60 font-light">
                    {userSearchQuery || userRoleFilter !== 'all'
                      ? 'No members matching your search criteria.'
                      : 'No users registered yet. New sign-ups will appear here automatically!'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9f9f9] border-b border-[#1c1c1a]/10 uppercase tracking-widest text-[#1c1c1a]/70 text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Member</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Date Joined</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1a]/5">
                      {filteredUsers.map((user) => {
                        const dateFormatted = new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <tr key={user.id} className="hover:bg-[#faf9f6] transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1c1c1a] text-white flex items-center justify-center text-[11px] font-medium uppercase">
                                  {user.firstName ? user.firstName[0] : user.name[0] || 'U'}
                                </div>
                                <div>
                                  <div className="font-medium text-[#1c1c1a]">{user.name}</div>
                                  <div className="text-[10px] text-[#1c1c1a]/50">
                                    ID: {user.id.slice(-6)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/80">
                              <a href={`mailto:${user.email}`} className="hover:underline">
                                {user.email}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                disabled={userUpdatingId === user.id}
                                onChange={(e) =>
                                  handleUserRoleChange(user.id, e.target.value as 'customer' | 'admin')
                                }
                                className={`text-[11px] uppercase tracking-wider py-1 px-2 rounded-xs border font-medium cursor-pointer focus:outline-none ${
                                  user.role === 'admin'
                                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                                    : 'bg-stone-50 border-stone-200 text-[#1c1c1a]'
                                }`}
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/70">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                              <a
                                href={`mailto:${user.email}?subject=Message from KSHAUM`}
                                className="inline-block px-2.5 py-1 text-[11px] border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-colors uppercase tracking-wider"
                              >
                                Email
                              </a>
                              <button
                                onClick={() => handleUserDelete(user.id, user.name)}
                                disabled={userUpdatingId === user.id}
                                className="inline-block px-2 py-1 text-[11px] border border-red-200 text-red-700 hover:bg-red-700 hover:text-white transition-colors uppercase tracking-wider cursor-pointer disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL WITH IMAGE UPLOAD & REMOVAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-sm border border-[#1c1c1a]/20 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#1c1c1a]/10 pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#bdb2a1] font-bold">
                  Catalogue Editor
                </span>
                <h2 className="text-xl font-serif text-[#1c1c1a] mt-1">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Garment'}
                </h2>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-lg leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6 text-xs">
              {/* Product Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Garment Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setProductForm((prev) => ({
                        ...prev,
                        name,
                        slug: editingProduct ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                      }));
                    }}
                    placeholder="e.g. Kaddy Top in Cotton"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    URL Slug*
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="e.g. kaddy-top-in-cotton"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
              </div>

              {/* Price, Compare Price, Category, Collection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Price (₹)*
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1650"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                    placeholder="1950"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Category*
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a] bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    placeholder="50"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
              </div>

              {/* Collection Name */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={productForm.collectionName}
                  onChange={(e) => setProductForm({ ...productForm, collectionName: e.target.value })}
                  placeholder="The Inheritance 01"
                  className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                />
              </div>

              {/* ================================================================= */}
              {/* IMAGE UPLOAD & GALLERY MANAGER */}
              {/* ================================================================= */}
              <div className="bg-[#f9f9f9] p-4 rounded-sm border border-[#1c1c1a]/15">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-[#1c1c1a]">
                      Garment Photos & Gallery
                    </span>
                    <span className="text-[10px] text-[#1c1c1a]/60 block">
                      First photo is used as the cover on catalog pages.
                    </span>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileUpload}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#1c1c1a] text-white text-[11px] uppercase tracking-wider hover:bg-[#333330] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {uploadingImage ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <span>+ Upload Photo</span>
                    )}
                  </button>
                </div>

                {/* Thumbnails List */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                  {productForm.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-[3/4] bg-stone-200 rounded-xs overflow-hidden border border-[#1c1c1a]/10"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        unoptimized={Boolean(imgUrl?.startsWith('data:'))}
                        className="object-cover"
                        sizes="120px"
                      />

                      {/* Primary Cover Badge */}
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-bold tracking-wider">
                          Cover
                        </div>
                      )}

                      {/* Hover Overlay with Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700 cursor-pointer"
                            title="Remove Photo"
                          >
                            ✕
                          </button>
                        </div>

                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleMakeImagePrimary(idx)}
                            className="bg-white text-black text-[9px] uppercase font-bold py-1 px-1.5 rounded-xs hover:bg-stone-100 cursor-pointer tracking-wider text-center"
                          >
                            Make Cover
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom/External Image URL */}
                <div className="flex gap-2 pt-2 border-t border-[#1c1c1a]/10">
                  <input
                    type="text"
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    placeholder="Or enter image URL/path (e.g. /image2.jpg or https://...)"
                    className="flex-1 border border-[#1c1c1a]/20 px-2.5 py-1.5 rounded-xs text-[11px] focus:outline-none focus:border-[#1c1c1a] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualImage}
                    className="px-3 py-1.5 border border-[#1c1c1a]/30 text-[11px] uppercase tracking-wider hover:bg-[#1c1c1a] hover:text-white transition-colors cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Colors (Comma Separated) */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                  Colors (comma separated)
                </label>
                <input
                  type="text"
                  value={productForm.colorsStr}
                  onChange={(e) => setProductForm({ ...productForm, colorsStr: e.target.value })}
                  placeholder="Black, Grey, Stone"
                  className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                />
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[11px] mb-2">
                  Available Sizes
                </label>
                <div className="flex gap-4">
                  {AVAILABLE_SIZES.map((size) => {
                    const isChecked = productForm.sizes.includes(size);
                    return (
                      <label key={size} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProductForm((prev) => ({ ...prev, sizes: [...prev.sizes, size] }));
                            } else {
                              setProductForm((prev) => ({
                                ...prev,
                                sizes: prev.sizes.filter((s) => s !== size),
                              }));
                            }
                          }}
                        />
                        <span>{size}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Fabric & Care */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Fabric Composition
                  </label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="100% Handcrafted Organic Cotton"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={productForm.care}
                    onChange={(e) => setProductForm({ ...productForm, care: e.target.value })}
                    placeholder="Dry clean or gentle hand wash."
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                  Product Description*
                </label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Architectural silhouette tailored with refined dropped shoulder seam..."
                  className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a] resize-none"
                />
              </div>

              {/* Flags */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  />
                  <span className="uppercase tracking-wider text-[11px]">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span className="uppercase tracking-wider text-[11px]">Featured Garment</span>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-4 border-t border-[#1c1c1a]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#1c1c1a]/20 uppercase tracking-wider text-xs hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productSubmitting || uploadingImage}
                  className="px-6 py-2 bg-[#1c1c1a] text-white uppercase tracking-wider text-xs hover:bg-[#333330] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {productSubmitting
                    ? 'Saving to MongoDB...'
                    : editingProduct
                    ? 'Save Changes'
                    : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
