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
  
  // Rich Attributes
  rating?: number;
  reviewsCount?: number;
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
  codAvailable?: boolean;
  freeShipping?: boolean;
  easyReturns?: string;
  
  // Companion
  completeTheSet?: string[];

  createdAt: string;
}

export interface OrderItem {
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  subtotal: number;
}

export interface OrderTimelineEvent {
  title: string;
  description?: string;
  createdAt: string;
  actor?: string;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'refunded' | 'failed';
  paymentMethod: 'razorpay' | 'cod' | 'card' | 'upi' | 'netbanking' | 'manual';
  channel: string;
  paymentDetails?: {
    transactionId?: string;
    gateway?: string;
    paymentDate?: string;
    refundId?: string;
    refundReason?: string;
    refundAmount?: number;
  };
  fulfillmentStatus: 'unfulfilled' | 'fulfilled' | 'in_transit' | 'delivered' | 'cancelled';
  fulfillmentDetails?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedDate?: string;
    deliveredDate?: string;
  };
  customerNotes?: string;
  staffNotes?: string[];
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CATEGORIES = ['Tops', 'Dresses', 'Skirts', 'Pants', 'Footwear', 'Accessories'];
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users'>('orders');

  // Custom Categories & Sizes State
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [isAddingNewSize, setIsAddingNewSize] = useState(false);
  const [newSizeInput, setNewSizeInput] = useState('');

  // Orders State (Shopify style)
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'all' | 'unfulfilled' | 'fulfilled' | 'paid' | 'pending' | 'delivered' | 'refunded' | 'cancelled'
  >('all');
  const [orderStats, setOrderStats] = useState({
    todayOrders: 0,
    totalOrders: 0,
    itemsOrdered: 0,
    totalRevenue: 0,
    ordersFulfilled: 0,
    ordersDelivered: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [staffCommentInput, setStaffCommentInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierNameInput, setCourierNameInput] = useState('');

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

  // Image Upload & Reshuffle State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null);
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
    rating: '4.9',
    reviewsCount: '18',
    fitNote: 'Relaxed Fit · Model is 6\'0" and wears M',
    fitType: 'Relaxed Fit',
    modelStats: 'Model is 6\'0" (183cm) and wears size M',
    fabric: '100% Handcrafted Organic Cotton. Breathable, textured natural drape.',
    fit: 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
    designDetailsStr: 'Relaxed architectural silhouette\nDropped shoulder seam detail\nNaturally breathable handwoven texture\nConcealed French seams for durability',
    care: 'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.',
    estimatedDelivery: '3–5 Business Days',
    codAvailable: true,
    freeShipping: true,
    easyReturns: '7-Day Complimentary Returns & Exchanges',
    completeTheSetStr: '',
  });

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (session?.user?.role !== 'admin') return;
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      setOrders(data.data || []);
      if (data.stats) setOrderStats(data.stats);
    } catch (err: unknown) {
      setOrdersError(err instanceof Error ? err.message : 'Error fetching orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [session?.user?.role]);

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
      fetchOrders();
      fetchProducts();
      fetchUsers();
    }
  }, [fetchOrders, fetchProducts, fetchUsers, session?.user?.role]);

  // Dynamically compute all unique categories
  const allCategories = useMemo(() => {
    const fromProducts = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories, ...fromProducts]));
  }, [products, customCategories]);

  // Handler to add a new category
  const handleAddNewCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (!allCategories.includes(formatted)) {
      setCustomCategories((prev) => [...prev, formatted]);
    }
    setProductForm((prev) => ({ ...prev, category: formatted }));
    setNewCategoryInput('');
    setIsAddingNewCategory(false);
  };

  // Dynamically compute all available sizes
  const allSizes = useMemo(() => {
    const fromAllProducts = products.flatMap((p) => p.sizes || []);
    return Array.from(
      new Set([...DEFAULT_SIZES, ...customSizes, ...fromAllProducts, ...(productForm.sizes || [])])
    );
  }, [products, customSizes, productForm.sizes]);

  // Handler to add a new size
  const handleAddNewSize = () => {
    const trimmed = newSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    if (!customSizes.includes(trimmed)) {
      setCustomSizes((prev) => [...prev, trimmed]);
    }
    if (!productForm.sizes.includes(trimmed)) {
      setProductForm((prev) => ({ ...prev, sizes: [...prev.sizes, trimmed] }));
    }
    setNewSizeInput('');
    setIsAddingNewSize(false);
  };

  // ---------------------------------------------------------------------------
  // ORDER ACTIONS & HANDLERS
  // ---------------------------------------------------------------------------

  const openOrderDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setTrackingNumberInput(order.fulfillmentDetails?.trackingNumber || '');
    setCourierNameInput(order.fulfillmentDetails?.courierName || 'Blue Dart Express');
    setStaffCommentInput('');
    setIsOrderDetailOpen(true);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    updates: {
      paymentStatus?: string;
      fulfillmentStatus?: string;
      trackingNumber?: string;
      courierName?: string;
      newStaffNote?: string;
    }
  ) => {
    try {
      setOrderUpdating(true);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, ...updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update order');

      // Update in local state
      setOrders((prev) => prev.map((ord) => (ord._id === orderId ? data.data : ord)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(data.data);
      }
      setStaffCommentInput('');
      await fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setOrderUpdating(false);
    }
  };

  const handleSeedOrders = async () => {
    if (!confirm('This will seed the database with sample orders from your reference. Continue?')) return;
    try {
      setOrdersLoading(true);
      const res = await fetch('/api/admin/orders/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to seed orders');
      alert(data.message);
      await fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to seed orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // USERS & PRODUCT ACTIONS
  // ---------------------------------------------------------------------------

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
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setUserUpdatingId(null);
    }
  };

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

  const openAddProductModal = () => {
    setEditingProduct(null);
    setManualImageUrl('');
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
    setIsAddingNewSize(false);
    setNewSizeInput('');
    setProductForm({
      name: '',
      slug: '',
      price: '',
      compareAtPrice: '',
      category: allCategories[0] || 'Tops',
      collectionName: 'The Inheritance 01',
      description: '',
      images: ['/image1.jpg'],
      colorsStr: 'Black, Grey, Stone',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      inStock: true,
      stockQuantity: '50',
      featured: false,
      rating: '4.9',
      reviewsCount: '18',
      fitNote: 'Relaxed Fit · Model is 6\'0" and wears M',
      fitType: 'Relaxed Fit',
      modelStats: 'Model is 6\'0" (183cm) and wears size M',
      fabric: '100% Handcrafted Organic Cotton. Breathable, textured natural drape.',
      fit: 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
      designDetailsStr: 'Relaxed architectural silhouette\nDropped shoulder seam detail\nNaturally breathable handwoven texture\nConcealed French seams for durability',
      care: 'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.',
      estimatedDelivery: '3–5 Business Days',
      codAvailable: true,
      freeShipping: true,
      easyReturns: '7-Day Complimentary Returns & Exchanges',
      completeTheSetStr: '',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductItem) => {
    setEditingProduct(product);
    setManualImageUrl('');
    setIsAddingNewCategory(false);
    setNewCategoryInput('');
    setIsAddingNewSize(false);
    setNewSizeInput('');
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
      rating: (product.rating || 4.9).toString(),
      reviewsCount: (product.reviewsCount || 18).toString(),
      fitNote: product.fitNote || 'Relaxed Fit · Model is 6\'0" and wears M',
      fitType: product.fitType || 'Relaxed Fit',
      modelStats: product.modelStats || 'Model is 6\'0" and wears M',
      fabric: product.fabric || '100% Handcrafted Organic Cotton. Breathable, textured natural drape.',
      fit: product.fit || 'Relaxed silhouette with dropped shoulder seam and clean tailored hems.',
      designDetailsStr: product.designDetails && product.designDetails.length > 0
        ? product.designDetails.join('\n')
        : product.details && product.details.length > 0
        ? product.details.join('\n')
        : 'Relaxed architectural silhouette\nDropped shoulder seam detail',
      care: product.care || 'Dry clean or gentle hand wash in cold water.',
      estimatedDelivery: product.estimatedDelivery || '3–5 Business Days',
      codAvailable: product.codAvailable !== false,
      freeShipping: product.freeShipping !== false,
      easyReturns: product.easyReturns || '7-Day Complimentary Returns & Exchanges',
      completeTheSetStr: product.completeTheSet ? product.completeTheSet.join(', ') : '',
    });
    setIsProductModalOpen(true);
  };

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

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const base64Url = await compressAndConvertToBase64(file);
      setProductForm((prev) => ({ ...prev, images: [...prev.images, base64Url] }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error converting image to Base64');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddManualImage = () => {
    const url = manualImageUrl.trim();
    if (!url) return;
    setProductForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setManualImageUrl('');
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= productForm.images.length) return;
    setProductForm((prev) => {
      const updated = [...prev.images];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, images: updated };
    });
  };

  const handleImageDrop = (targetIndex: number) => {
    if (draggedImageIdx === null || draggedImageIdx === targetIndex) return;
    setProductForm((prev) => {
      const updated = [...prev.images];
      const [movedItem] = updated.splice(draggedImageIdx, 1);
      updated.splice(targetIndex, 0, movedItem);
      return { ...prev, images: updated };
    });
    setDraggedImageIdx(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, images: updated.length > 0 ? updated : ['/image1.jpg'] };
    });
  };

  const handleMakeImagePrimary = (indexToPrimary: number) => {
    setProductForm((prev) => {
      const selected = prev.images[indexToPrimary];
      const rest = prev.images.filter((_, idx) => idx !== indexToPrimary);
      return { ...prev, images: [selected, ...rest] };
    });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert('Please fill in Name, Price, and Description.');
      return;
    }

    setProductSubmitting(true);
    try {
      const colors = productForm.colorsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const designDetails = productForm.designDetailsStr.split('\n').map((s) => s.trim()).filter(Boolean);
      const completeTheSet = productForm.completeTheSetStr.split(',').map((s) => s.trim()).filter(Boolean);

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
        rating: parseFloat(productForm.rating || '4.9'),
        reviewsCount: parseInt(productForm.reviewsCount || '18', 10),
        fitNote: productForm.fitNote.trim(),
        fitType: productForm.fitType.trim(),
        modelStats: productForm.modelStats.trim(),
        fabric: productForm.fabric.trim(),
        fit: productForm.fit.trim(),
        designDetails,
        details: designDetails,
        care: productForm.care.trim(),
        estimatedDelivery: productForm.estimatedDelivery.trim(),
        codAvailable: productForm.codAvailable,
        freeShipping: productForm.freeShipping,
        easyReturns: productForm.easyReturns.trim(),
        completeTheSet,
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

  // Filtered Orders Computation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const q = orderSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customer.name.toLowerCase().includes(q) ||
        ord.customer.email.toLowerCase().includes(q) ||
        (ord.customer.phone && ord.customer.phone.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (orderStatusFilter === 'all') return true;
      if (orderStatusFilter === 'unfulfilled') return ord.fulfillmentStatus === 'unfulfilled';
      if (orderStatusFilter === 'fulfilled') return ord.fulfillmentStatus === 'fulfilled';
      if (orderStatusFilter === 'delivered') return ord.fulfillmentStatus === 'delivered';
      if (orderStatusFilter === 'paid') return ord.paymentStatus === 'paid';
      if (orderStatusFilter === 'pending') return ord.paymentStatus === 'pending' || ord.paymentStatus === 'partially_paid';
      if (orderStatusFilter === 'refunded') return ord.paymentStatus === 'refunded';
      if (orderStatusFilter === 'cancelled') return ord.fulfillmentStatus === 'cancelled';
      return true;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Users & Products
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

  const userStats = useMemo(() => ({
    total: users.length,
    customers: users.filter((u) => u.role === 'customer').length,
    admins: users.filter((u) => u.role === 'admin').length,
  }), [users]);

  const productStats = useMemo(() => ({
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    featured: products.filter((p) => p.featured).length,
    categoriesCount: Array.from(new Set(products.map((p) => p.category))).length,
  }), [products]);

  // ---------------------------------------------------------------------------
  // AUTH GUARDS
  // ---------------------------------------------------------------------------

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
              Please sign in with your verified administrator account.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/login?callbackUrl=/admin"
              className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors"
            >
              Sign In to Admin Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login?callbackUrl=/admin' })}
            className="block w-full bg-[#1c1c1a] text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-[#333330] transition-colors cursor-pointer"
          >
            Sign In with Admin Account
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1c1c1a] font-sans antialiased">
      {/* Top Header */}
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
              Atelier Management
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#1c1c1a]/15 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#1c1c1a]/70">Admin:</span>
              <strong className="text-[#1c1c1a]">{session.user.name || session.user.email}</strong>
            </div>

            {activeTab === 'orders' && (
              <>
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {ordersLoading ? 'Syncing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleSeedOrders}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 bg-[#1c1c1a] text-white hover:bg-[#333330] transition-all cursor-pointer"
                >
                  Seed Shopify Demo
                </button>
              </>
            )}

            {activeTab === 'products' && (
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
              </>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-xs uppercase tracking-widest px-3 py-1.5 text-stone-500 hover:text-red-700 transition-colors cursor-pointer"
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
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.2em] font-medium transition-all cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#1c1c1a] text-[#1c1c1a]'
                : 'border-transparent text-[#1c1c1a]/50 hover:text-[#1c1c1a]'
            }`}
          >
            <span>📦 Orders</span>
            <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

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
        {/* TAB 1: SHOPIFY-STYLE ORDERS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Shopify-Style Top KPI Metrics Header */}
            <div className="bg-white rounded-sm border border-[#1c1c1a]/10 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#1c1c1a]/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#1c1c1a]">
                    Orders Performance
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  Live MongoDB Real-Time Sync
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-x-0 sm:divide-x divide-[#1c1c1a]/10">
                <div className="px-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#1c1c1a]/60 font-semibold block">
                    Orders
                  </span>
                  <div className="text-2xl font-serif text-[#1c1c1a] mt-1">
                    {orderStats.totalOrders}
                  </div>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    {orderStats.todayOrders} placed today
                  </span>
                </div>

                <div className="px-2 sm:pl-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#1c1c1a]/60 font-semibold block">
                    Items Ordered
                  </span>
                  <div className="text-2xl font-serif text-[#1c1c1a] mt-1">
                    {orderStats.itemsOrdered}
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    garments total
                  </span>
                </div>

                <div className="px-2 sm:pl-4">
                  <span className="text-[11px] uppercase tracking-wider text-[#1c1c1a]/60 font-semibold block">
                    Net Sales
                  </span>
                  <div className="text-2xl font-serif text-[#1c1c1a] mt-1">
                    ₹{orderStats.totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Paid volume
                  </span>
                </div>

                <div className="px-2 sm:pl-4">
                  <span className="text-[11px] uppercase tracking-wider text-purple-800 font-semibold block">
                    Orders Fulfilled
                  </span>
                  <div className="text-2xl font-serif text-purple-950 mt-1">
                    {orderStats.ordersFulfilled}
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Dispatched
                  </span>
                </div>

                <div className="px-2 sm:pl-4">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold block">
                    Delivered
                  </span>
                  <div className="text-2xl font-serif text-emerald-950 mt-1">
                    {orderStats.ordersDelivered}
                  </div>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    Successfully received
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar (Shopify style) */}
            <div className="bg-white p-4 rounded-sm border border-[#1c1c1a]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'unfulfilled', label: 'Unfulfilled' },
                  { id: 'fulfilled', label: 'Fulfilled' },
                  { id: 'paid', label: 'Paid' },
                  { id: 'pending', label: 'Payment Pending' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'refunded', label: 'Refunded' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id as typeof orderStatusFilter)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors cursor-pointer ${
                      orderStatusFilter === tab.id
                        ? 'bg-[#1c1c1a] text-white shadow-xs'
                        : 'bg-[#f9f9f9] border border-[#1c1c1a]/15 text-[#1c1c1a]/70 hover:text-[#1c1c1a]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search orders by #, customer name, email, phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full text-xs bg-[#f9f9f9] border border-[#1c1c1a]/15 px-3 py-2 rounded-sm focus:outline-none focus:border-[#1c1c1a]"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Shopify-Style Orders Table */}
            <div className="bg-white rounded-sm border border-[#1c1c1a]/10 overflow-hidden shadow-xs">
              {ordersLoading && orders.length === 0 ? (
                <div className="py-20 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
                  Loading orders from MongoDB Atlas...
                </div>
              ) : ordersError ? (
                <div className="py-12 text-center text-sm text-red-600">
                  {ordersError}
                  <div className="mt-2">
                    <button
                      onClick={fetchOrders}
                      className="text-xs uppercase underline tracking-wider cursor-pointer"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm text-[#1c1c1a]/60 font-light">
                    {orderSearchQuery || orderStatusFilter !== 'all'
                      ? 'No orders match your filter criteria.'
                      : 'No orders placed yet.'}
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={handleSeedOrders}
                      className="px-4 py-2 bg-[#1c1c1a] text-white text-xs uppercase tracking-wider cursor-pointer hover:bg-[#333330]"
                    >
                      Seed Sample Orders (Shopify Demo)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9f9f9] border-b border-[#1c1c1a]/10 uppercase tracking-widest text-[#1c1c1a]/70 text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment Status</th>
                        <th className="py-3 px-4">Fulfillment</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Delivery Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1c1a]/5 font-sans">
                      {filteredOrders.map((ord) => {
                        const rawDate = ord.createdAt || ord.paymentDetails?.paymentDate || ord.updatedAt;
                        const parsedDate = rawDate ? new Date(rawDate) : new Date();
                        const dateFormatted = !isNaN(parsedDate.getTime())
                          ? parsedDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent';

                        const totalItems = (ord.items || []).reduce(
                          (acc, item) => acc + (item.quantity || 1),
                          0
                        );

                        return (
                          <tr
                            key={ord._id}
                            onClick={() => openOrderDetail(ord)}
                            className="hover:bg-[#faf9f6] transition-colors cursor-pointer group"
                          >
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-bold text-[#1c1c1a] group-hover:underline font-mono">
                                {ord.orderNumber}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/70 text-[11px]">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-medium text-[#1c1c1a]">{ord.customer.name}</div>
                              <div className="text-[10px] text-[#1c1c1a]/50">{ord.customer.email}</div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#1c1c1a]/70 font-mono">
                              {ord.channel || 'Online Store'}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#1c1c1a]">
                              ₹{ord.totalAmount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {ord.paymentStatus === 'paid' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  Paid
                                </span>
                              ) : ord.paymentStatus === 'partially_paid' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                  Partially paid
                                </span>
                              ) : ord.paymentStatus === 'refunded' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                                  Refunded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                                  Payment pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {ord.fulfillmentStatus === 'fulfilled' || ord.fulfillmentStatus === 'delivered' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                                  Fulfilled
                                </span>
                              ) : ord.fulfillmentStatus === 'cancelled' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-900 border border-yellow-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                                  Unfulfilled
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/70 text-[11px]">
                              {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {ord.fulfillmentStatus === 'delivered' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800">
                                  <span>●</span> Delivered
                                </span>
                              ) : ord.fulfillmentDetails?.trackingNumber ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-800">
                                  <span>●</span> Tracking added
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-400">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderDetail(ord);
                                }}
                                className="px-2.5 py-1 text-[11px] border border-[#1c1c1a]/20 hover:bg-[#1c1c1a] hover:text-white transition-colors uppercase tracking-wider"
                              >
                                View ↗
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

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS & INVENTORY */}
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
              <div className="flex flex-wrap gap-1">
                {['All', ...allCategories].map((cat) => (
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
                  <div className="mt-4">
                    <button
                      onClick={openAddProductModal}
                      className="px-4 py-2 bg-[#1c1c1a] text-white text-xs uppercase tracking-wider cursor-pointer hover:bg-[#333330]"
                    >
                      + Add First Product
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9f9f9] border-b border-[#1c1c1a]/10 uppercase tracking-widest text-[#1c1c1a]/70 text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Fit Note</th>
                        <th className="py-3 px-4">Stock</th>
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
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-amber-700 font-medium">★ {prod.rating || 4.9}</span>
                            <span className="text-[10px] text-stone-400 ml-1">({prod.reviewsCount || 18})</span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/80">
                            {prod.category}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-[#1c1c1a]">
                              ₹{prod.price.toLocaleString()}
                            </div>
                            <div className="text-[9px] text-[#1c1c1a]/50">
                              Incl. of taxes
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-[#1c1c1a]/70 max-w-xs truncate">
                            {prod.fitNote || 'Relaxed Fit'}
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
        {/* TAB 3: REGISTERED USERS */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div>
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
              </div>
            </div>

            <div className="bg-white rounded-sm border border-[#1c1c1a]/10 overflow-hidden shadow-xs">
              {filteredUsers.length === 0 ? (
                <div className="py-20 text-center text-sm text-[#1c1c1a]/60">
                  No members found.
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#faf9f6] transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#1c1c1a] text-white flex items-center justify-center text-[11px] font-medium uppercase">
                                {user.firstName ? user.firstName[0] : user.name[0] || 'U'}
                              </div>
                              <div className="font-medium text-[#1c1c1a]">{user.name}</div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-[#1c1c1a]/80">
                            {user.email}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              disabled={userUpdatingId === user.id}
                              onChange={(e) =>
                                handleUserRoleChange(user.id, e.target.value as 'customer' | 'admin')
                              }
                              className={`text-[11px] uppercase tracking-wider py-1 px-2 rounded-xs border font-medium cursor-pointer ${
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
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleUserDelete(user.id, user.name)}
                              disabled={userUpdatingId === user.id}
                              className="px-2 py-1 text-[11px] border border-red-200 text-red-700 hover:bg-red-700 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              Delete
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
      </main>

      {/* ========================================================================= */}
      {/* SHOPIFY-STYLE ORDER DETAIL DRAWER / MODAL */}
      {/* ========================================================================= */}
      {isOrderDetailOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#f6f6f7] w-full max-w-5xl rounded-sm border border-[#1c1c1a]/20 shadow-2xl my-6 max-h-[92vh] overflow-y-auto flex flex-col">
            {/* Modal Top Nav & Header (Shopify style) */}
            <div className="bg-white border-b border-[#1c1c1a]/15 p-4 sm:p-6 sticky top-0 z-20 flex justify-between items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#1c1c1a]">
                    {selectedOrder.orderNumber}
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : selectedOrder.paymentStatus === 'refunded'
                        ? 'bg-stone-200 text-stone-800'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    ● {selectedOrder.paymentStatus}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedOrder.fulfillmentStatus === 'fulfilled' || selectedOrder.fulfillmentStatus === 'delivered'
                        ? 'bg-stone-200 text-stone-900'
                        : selectedOrder.fulfillmentStatus === 'cancelled'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                    }`}
                  >
                    ● {selectedOrder.fulfillmentStatus}
                  </span>
                </div>
                <p className="text-xs text-[#1c1c1a]/60">
                  {(() => {
                    const rawDate = selectedOrder.createdAt || selectedOrder.paymentDetails?.paymentDate || selectedOrder.updatedAt;
                    const parsedDate = rawDate ? new Date(rawDate) : new Date();
                    return !isNaN(parsedDate.getTime())
                      ? parsedDate.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently placed';
                  })()}{' '}
                  from {selectedOrder.channel}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOrderDetailOpen(false)}
                  className="w-8 h-8 rounded-full border border-stone-300 hover:bg-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Column Shopify Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
              {/* LEFT COLUMN (8 cols): Line items, financial summary, timeline */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Line Items Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1c1c1a]/10 pb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a]">
                      Items in Order ({(selectedOrder.items || []).length})
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Location: KSHAUM Atelier Rajasthan
                    </span>
                  </div>

                  <div className="divide-y divide-[#1c1c1a]/5">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-16 bg-[#e8e4dc]/40 rounded-xs overflow-hidden flex-shrink-0 border border-[#1c1c1a]/10">
                            <Image
                              src={item.image || '/image1.jpg'}
                              alt={item.name}
                              fill
                              unoptimized={Boolean(item.image?.startsWith('data:'))}
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#1c1c1a]">{item.name}</div>
                            <div className="text-xs text-stone-500 mt-0.5">
                              {item.size} / {item.color}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                              SKU: {item.slug}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-xs text-[#1c1c1a]/70">
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </div>
                          <div className="font-bold text-sm text-[#1c1c1a] mt-0.5">
                            ₹{item.subtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Action Bar */}
                  <div className="border-t border-[#1c1c1a]/10 pt-4 flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-xs">
                    <div className="text-xs">
                      <span className="font-semibold block text-[#1c1c1a]">Fulfillment State</span>
                      <span className="text-stone-500 text-[11px]">
                        Status:{' '}
                        <strong className="text-[#1c1c1a] uppercase">
                          {selectedOrder.fulfillmentStatus}
                        </strong>
                        {selectedOrder.fulfillmentDetails?.courierName && (
                          <span>
                            {' '}
                            via {selectedOrder.fulfillmentDetails.courierName} (Waybill:{' '}
                            {selectedOrder.fulfillmentDetails.trackingNumber})
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedOrder.fulfillmentStatus !== 'fulfilled' &&
                        selectedOrder.fulfillmentStatus !== 'delivered' && (
                          <button
                            type="button"
                            disabled={orderUpdating}
                            onClick={() =>
                              handleUpdateOrderStatus(selectedOrder._id, {
                                fulfillmentStatus: 'fulfilled',
                              })
                            }
                            className="px-3 py-1.5 bg-[#1c1c1a] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#333330] cursor-pointer disabled:opacity-50"
                          >
                            Mark as Fulfilled
                          </button>
                        )}

                      {selectedOrder.fulfillmentStatus === 'fulfilled' && (
                        <button
                          type="button"
                          disabled={orderUpdating}
                          onClick={() =>
                            handleUpdateOrderStatus(selectedOrder._id, {
                              fulfillmentStatus: 'delivered',
                            })
                          }
                          className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-medium uppercase tracking-wider hover:bg-emerald-900 cursor-pointer disabled:opacity-50"
                        >
                          Mark as Delivered ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Financial Breakdown Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2">
                    Payment Breakdown
                  </div>

                  <div className="space-y-1.5 text-xs text-[#1c1c1a]/80">
                    <div className="flex justify-between">
                      <span>Subtotal ({selectedOrder.items.length} items)</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping (Standard Prepaid)</span>
                      <span className="text-emerald-700">₹0.00 (Free)</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Promotional Discount</span>
                        <span>-₹{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1c1c1a] border-t border-[#1c1c1a]/10 pt-2">
                      <span>Total Amount</span>
                      <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-xs pt-1 border-t border-[#1c1c1a]/5">
                      <span>Paid by Customer</span>
                      <span className="font-semibold">
                        {selectedOrder.paymentStatus === 'paid'
                          ? `₹${selectedOrder.totalAmount.toLocaleString()}`
                          : selectedOrder.paymentStatus === 'partially_paid'
                          ? 'Partial Deposit'
                          : '₹0.00'}
                      </span>
                    </div>

                    {selectedOrder.paymentDetails?.refundAmount && (
                      <div className="flex justify-between text-xs text-red-700">
                        <span>Refunded ({selectedOrder.paymentDetails.refundReason || 'Cancelled'})</span>
                        <span>-₹{selectedOrder.paymentDetails.refundAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Action Bar */}
                  <div className="border-t border-[#1c1c1a]/10 pt-3 flex justify-between items-center">
                    <span className="text-[11px] text-stone-500">
                      Gateway: {selectedOrder.paymentDetails?.gateway || selectedOrder.channel}
                    </span>
                    <div className="space-x-2">
                      {selectedOrder.paymentStatus !== 'paid' && (
                        <button
                          type="button"
                          disabled={orderUpdating}
                          onClick={() =>
                            handleUpdateOrderStatus(selectedOrder._id, {
                              paymentStatus: 'paid',
                            })
                          }
                          className="px-3 py-1 border border-emerald-600 text-emerald-800 hover:bg-emerald-600 hover:text-white text-[11px] uppercase font-bold rounded-xs cursor-pointer"
                        >
                          Mark as Paid
                        </button>
                      )}
                      {selectedOrder.paymentStatus !== 'refunded' && (
                        <button
                          type="button"
                          disabled={orderUpdating}
                          onClick={() => {
                            if (confirm('Mark this order as Refunded?')) {
                              handleUpdateOrderStatus(selectedOrder._id, {
                                paymentStatus: 'refunded',
                                fulfillmentStatus: 'cancelled',
                              });
                            }
                          }}
                          className="px-3 py-1 border border-red-300 text-red-700 hover:bg-red-700 hover:text-white text-[11px] uppercase font-bold rounded-xs cursor-pointer"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Timeline & Staff Comments Card (Matching Screenshot 3) */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-4">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2">
                    Order Timeline & Activity
                  </div>

                  {/* Comment Box */}
                  <div className="bg-stone-50 p-3 rounded-xs border border-stone-200">
                    <div className="text-[11px] font-semibold text-[#1c1c1a] mb-1">
                      Add Internal Staff Comment
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={staffCommentInput}
                        onChange={(e) => setStaffCommentInput(e.target.value)}
                        placeholder="Leave a comment (only staff can see)..."
                        className="flex-1 bg-white border border-stone-300 px-3 py-1.5 text-xs rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (staffCommentInput.trim()) {
                              handleUpdateOrderStatus(selectedOrder._id, {
                                newStaffNote: staffCommentInput.trim(),
                              });
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={orderUpdating || !staffCommentInput.trim()}
                        onClick={() =>
                          handleUpdateOrderStatus(selectedOrder._id, {
                            newStaffNote: staffCommentInput.trim(),
                          })
                        }
                        className="px-4 py-1.5 bg-[#1c1c1a] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#333330] cursor-pointer disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Chronological Timeline Events */}
                  <div className="space-y-4 pt-2">
                    {(selectedOrder.timeline || []).map((ev, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#1c1c1a] mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-[#1c1c1a]">{ev.title}</span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {(() => {
                                const d = ev.createdAt ? new Date(ev.createdAt) : new Date();
                                return !isNaN(d.getTime())
                                  ? d.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Recent';
                              })()}
                            </span>
                          </div>
                          {ev.description && (
                            <p className="text-[11px] text-[#1c1c1a]/70 mt-0.5">
                              {ev.description}
                            </p>
                          )}
                          <span className="text-[9px] text-stone-400">By {ev.actor || 'System'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (4 cols): Customer, Addresses, Channel Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Customer Profile Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2">
                    Customer Details
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1c1c1a]">
                      {selectedOrder.customer.name}
                    </div>
                    <a
                      href={`mailto:${selectedOrder.customer.email}`}
                      className="text-xs text-blue-700 hover:underline block mt-0.5"
                    >
                      {selectedOrder.customer.email}
                    </a>
                    {selectedOrder.customer.phone && (
                      <a
                        href={`tel:${selectedOrder.customer.phone}`}
                        className="text-xs text-[#1c1c1a]/80 block mt-0.5"
                      >
                        {selectedOrder.customer.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2 flex justify-between items-center">
                    <span>Shipping Address</span>
                  </div>
                  <div className="text-xs text-[#1c1c1a]/80 leading-relaxed">
                    <p className="font-semibold text-[#1c1c1a]">
                      {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p>{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                    {selectedOrder.shippingAddress.phone && (
                      <p className="text-[11px] text-stone-500 mt-1">
                        Phone: {selectedOrder.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Courier & Waybill Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2">
                    Shipping & Waybill
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                        Courier Partner
                      </label>
                      <input
                        type="text"
                        value={courierNameInput}
                        onChange={(e) => setCourierNameInput(e.target.value)}
                        placeholder="Blue Dart / Delhivery"
                        className="w-full bg-stone-50 border border-stone-300 p-1.5 text-xs rounded-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                        Tracking Number (AWB)
                      </label>
                      <input
                        type="text"
                        value={trackingNumberInput}
                        onChange={(e) => setTrackingNumberInput(e.target.value)}
                        placeholder="e.g. BLUEDART-99201"
                        className="w-full bg-stone-50 border border-stone-300 p-1.5 text-xs rounded-xs font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={orderUpdating}
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrder._id, {
                          trackingNumber: trackingNumberInput.trim(),
                          courierName: courierNameInput.trim(),
                        })
                      }
                      className="w-full bg-[#1c1c1a] text-white py-2 text-xs uppercase font-medium tracking-wider hover:bg-[#333330] cursor-pointer"
                    >
                      Update Tracking Details
                    </button>
                  </div>
                </div>

                {/* Channel & Technical Card */}
                <div className="bg-white p-5 rounded-sm border border-[#1c1c1a]/10 shadow-xs space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-2">
                    Channel & Gateway
                  </div>
                  <div className="text-[11px] text-stone-600 space-y-1 font-mono">
                    <div>Channel: {selectedOrder.channel}</div>
                    <div>Payment: {selectedOrder.paymentMethod.toUpperCase()}</div>
                    {selectedOrder.paymentDetails?.transactionId && (
                      <div className="truncate">Txn: {selectedOrder.paymentDetails.transactionId}</div>
                    )}
                    <div className="text-[10px] text-stone-400">Order ID: {selectedOrder._id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-sm border border-[#1c1c1a]/20 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
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
              {/* SECTION 1: General Info */}
              <div className="space-y-4">
                <div className="font-semibold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-1">
                  1. General Information
                </div>

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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="min-w-0">
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
                    <span className="text-[9px] text-stone-400 mt-0.5 block">Incl. of all taxes</span>
                  </div>

                  <div className="min-w-0">
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

                  <div className="min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-semibold uppercase tracking-wider text-[11px] truncate">
                        Category*
                      </label>
                      {!isAddingNewCategory && (
                        <button
                          type="button"
                          onClick={() => setIsAddingNewCategory(true)}
                          className="text-[10px] uppercase font-bold text-stone-600 hover:text-black underline cursor-pointer ml-1 whitespace-nowrap"
                        >
                          + New
                        </button>
                      )}
                    </div>

                    {!isAddingNewCategory ? (
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          if (e.target.value === '__new__') {
                            setIsAddingNewCategory(true);
                          } else {
                            setProductForm({ ...productForm, category: e.target.value });
                          }
                        }}
                        className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a] bg-white cursor-pointer text-xs"
                      >
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__new__">+ Add New Category...</option>
                      </select>
                    ) : (
                      <div className="relative w-full">
                        <input
                          type="text"
                          autoFocus
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewCategory();
                            }
                          }}
                          placeholder="New category"
                          className="w-full border border-[#1c1c1a] p-2 pr-14 text-xs rounded-xs focus:outline-none bg-white"
                        />
                        <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleAddNewCategory}
                            className="h-full px-2 bg-[#1c1c1a] text-white text-[10px] uppercase font-bold rounded-xs hover:bg-[#333330] cursor-pointer flex items-center justify-center shadow-xs"
                            title="Save Category"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewCategory(false);
                              setNewCategoryInput('');
                            }}
                            className="h-full px-1 text-stone-400 hover:text-stone-800 text-xs cursor-pointer flex items-center justify-center"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Product Rating (1 - 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                      placeholder="4.9"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Reviews Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.reviewsCount}
                      onChange={(e) => setProductForm({ ...productForm, reviewsCount: e.target.value })}
                      placeholder="18"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Photos Gallery */}
              <div className="space-y-4">
                <div className="font-semibold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-1">
                  2. Garment Photos & Gallery
                </div>

                <div className="bg-[#f9f9f9] p-4 rounded-sm border border-[#1c1c1a]/15">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[#1c1c1a]">
                        Photo Gallery
                      </span>
                      <span className="text-[10px] text-[#1c1c1a]/60 block">
                        First photo is used as the cover on catalog pages.
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#1c1c1a] text-white text-[11px] uppercase tracking-wider hover:bg-[#333330] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {uploadingImage ? 'Uploading...' : '+ Upload Photo'}
                    </button>
                  </div>

                  {/* Drag and Drop instructions */}
                  <div className="mb-3 flex items-center justify-between text-[11px] text-[#1c1c1a]/70 bg-stone-100 px-3 py-2 rounded-xs border border-stone-200">
                    <span>
                      💡 <strong>Reshuffle Sequence:</strong> Drag & drop photos, or use the <strong>← / →</strong> buttons. Photo <strong>#1</strong> is always the cover.
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {productForm.images.length} {productForm.images.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {productForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => setDraggedImageIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleImageDrop(idx)}
                        className={`relative group aspect-[3/4] bg-stone-200 rounded-xs overflow-hidden border transition-all cursor-grab active:cursor-grabbing ${
                          draggedImageIdx === idx
                            ? 'opacity-40 border-dashed border-[#1c1c1a] scale-95'
                            : 'border-[#1c1c1a]/15 hover:border-[#1c1c1a] shadow-xs'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Photo ${idx + 1}`}
                          fill
                          unoptimized={Boolean(imgUrl?.startsWith('data:'))}
                          className="object-cover"
                          sizes="160px"
                        />

                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                          <span className="bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-xs font-bold">
                            #{idx + 1}
                          </span>
                          {idx === 0 && (
                            <span className="bg-amber-600 text-white text-[9px] uppercase px-1.5 py-0.5 rounded-xs font-bold tracking-wider">
                              Cover
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center z-10">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="bg-white/90 text-[#1c1c1a] text-[10px] w-5 h-5 rounded-xs flex items-center justify-center hover:bg-[#1c1c1a] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-xs cursor-pointer font-bold"
                            title="Move Left"
                          >
                            ←
                          </button>

                          <button
                            type="button"
                            disabled={idx === productForm.images.length - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="bg-white/90 text-[#1c1c1a] text-[10px] w-5 h-5 rounded-xs flex items-center justify-center hover:bg-[#1c1c1a] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none shadow-xs cursor-pointer font-bold"
                            title="Move Right"
                          >
                            →
                          </button>
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-20">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700 cursor-pointer shadow-xs"
                              title="Remove Photo"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="space-y-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleMakeImagePrimary(idx)}
                                className="w-full bg-white text-black text-[9px] uppercase font-bold py-1 px-1.5 rounded-xs hover:bg-stone-100 cursor-pointer tracking-wider text-center block shadow-xs"
                              >
                                ★ Make Cover
                              </button>
                            )}

                            <div className="flex justify-between gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImage(idx, 'left')}
                                className="flex-1 bg-black/80 text-white text-[9px] py-0.5 rounded-xs hover:bg-black disabled:opacity-30 cursor-pointer"
                              >
                                ← Move
                              </button>
                              <button
                                type="button"
                                disabled={idx === productForm.images.length - 1}
                                onClick={() => handleMoveImage(idx, 'right')}
                                className="flex-1 bg-black/80 text-white text-[9px] py-0.5 rounded-xs hover:bg-black disabled:opacity-30 cursor-pointer"
                              >
                                Move →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
              </div>

              {/* SECTION 3: Sizing & Fit */}
              <div className="space-y-4">
                <div className="font-semibold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-1">
                  3. Colors, Sizing & Fit Specifications
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Colors (comma separated swatches)
                  </label>
                  <input
                    type="text"
                    value={productForm.colorsStr}
                    onChange={(e) => setProductForm({ ...productForm, colorsStr: e.target.value })}
                    placeholder="Black, Grey, Stone"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block font-semibold uppercase tracking-wider text-[11px]">
                      Available Sizes
                    </label>
                    {!isAddingNewSize && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewSize(true)}
                        className="text-[10px] uppercase font-bold text-stone-600 hover:text-black underline cursor-pointer"
                      >
                        + Add Custom Size
                      </button>
                    )}
                  </div>

                  {isAddingNewSize && (
                    <div className="mb-3 p-2.5 bg-stone-100 rounded-xs border border-stone-200 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <span className="text-[11px] font-semibold text-[#1c1c1a] whitespace-nowrap">
                        New Size:
                      </span>
                      <div className="relative flex-1 max-w-xs w-full">
                        <input
                          type="text"
                          autoFocus
                          value={newSizeInput}
                          onChange={(e) => setNewSizeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewSize();
                            }
                          }}
                          placeholder="e.g. 3XL, 28, Free Size, UK 8"
                          className="w-full border border-[#1c1c1a] p-1.5 pr-14 text-xs rounded-xs focus:outline-none bg-white font-mono"
                        />
                        <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleAddNewSize}
                            className="h-full px-2 bg-[#1c1c1a] text-white text-[10px] uppercase font-bold rounded-xs hover:bg-[#333330] cursor-pointer flex items-center justify-center shadow-xs"
                            title="Add Size"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewSize(false);
                              setNewSizeInput('');
                            }}
                            className="h-full px-1 text-stone-400 hover:text-stone-800 text-xs cursor-pointer flex items-center justify-center"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => {
                      const isChecked = productForm.sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setProductForm((prev) => ({
                                ...prev,
                                sizes: prev.sizes.filter((s) => s !== size),
                              }));
                            } else {
                              setProductForm((prev) => ({
                                ...prev,
                                sizes: [...prev.sizes, size],
                              }));
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-[#1c1c1a] border-[#1c1c1a] text-white shadow-xs font-bold'
                              : 'bg-white border-[#1c1c1a]/20 text-[#1c1c1a]/70 hover:border-[#1c1c1a]'
                          }`}
                        >
                          <span>{isChecked ? '✓' : '+'}</span>
                          <span>{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Short Fit Note
                    </label>
                    <input
                      type="text"
                      value={productForm.fitNote}
                      onChange={(e) => setProductForm({ ...productForm, fitNote: e.target.value })}
                      placeholder="e.g. Relaxed Fit · Model is 6'0&quot; and wears M"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Model Dimensions
                    </label>
                    <input
                      type="text"
                      value={productForm.modelStats}
                      onChange={(e) => setProductForm({ ...productForm, modelStats: e.target.value })}
                      placeholder="e.g. Model is 6'0&quot; (183cm) and wears size M"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Narrative & Accordions */}
              <div className="space-y-4">
                <div className="font-semibold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-1">
                  4. Product Narrative & Accordion Content
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Editorial Description*
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Fabric & Feel
                    </label>
                    <input
                      type="text"
                      value={productForm.fabric}
                      onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                      placeholder="100% Handcrafted Organic Cotton."
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Fit Description
                    </label>
                    <input
                      type="text"
                      value={productForm.fit}
                      onChange={(e) => setProductForm({ ...productForm, fit: e.target.value })}
                      placeholder="Relaxed silhouette with dropped shoulders."
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Design Details (One pointer per line)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.designDetailsStr}
                    onChange={(e) => setProductForm({ ...productForm, designDetailsStr: e.target.value })}
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a] resize-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Wash Care Guidelines
                  </label>
                  <input
                    type="text"
                    value={productForm.care}
                    onChange={(e) => setProductForm({ ...productForm, care: e.target.value })}
                    placeholder="Dry clean or gentle hand wash in cold water."
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
              </div>

              {/* SECTION 5: Trust Signals & Companion Set */}
              <div className="space-y-4">
                <div className="font-semibold text-xs uppercase tracking-wider text-[#1c1c1a] border-b border-[#1c1c1a]/10 pb-1">
                  5. Trust Signals & Companion Pieces
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Estimated Delivery
                    </label>
                    <input
                      type="text"
                      value={productForm.estimatedDelivery}
                      onChange={(e) => setProductForm({ ...productForm, estimatedDelivery: e.target.value })}
                      placeholder="3–5 Business Days"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                      Return Policy
                    </label>
                    <input
                      type="text"
                      value={productForm.easyReturns}
                      onChange={(e) => setProductForm({ ...productForm, easyReturns: e.target.value })}
                      placeholder="7-Day Complimentary Returns"
                      className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.codAvailable}
                      onChange={(e) => setProductForm({ ...productForm, codAvailable: e.target.checked })}
                    />
                    <span className="uppercase tracking-wider text-[11px]">COD Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.freeShipping}
                      onChange={(e) => setProductForm({ ...productForm, freeShipping: e.target.checked })}
                    />
                    <span className="uppercase tracking-wider text-[11px]">Free Shipping</span>
                  </label>
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
                    <span className="uppercase tracking-wider text-[11px]">Featured</span>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] mb-1">
                    Complete the Set (Companion product slugs, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={productForm.completeTheSetStr}
                    onChange={(e) => setProductForm({ ...productForm, completeTheSetStr: e.target.value })}
                    placeholder="e.g. alfidis-pant-in-cotton, stella-slipper-in-leather"
                    className="w-full border border-[#1c1c1a]/20 p-2 rounded-xs focus:outline-none focus:border-[#1c1c1a]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
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
                    ? 'Saving...'
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
