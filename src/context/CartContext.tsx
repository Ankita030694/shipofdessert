'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string;
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
}

interface AddToCartInput {
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: AddToCartInput) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kshaum_cart_items';
const SESSION_STORAGE_KEY = 'kshaum_guest_session_id';

// Helper to get or create guest session UUID
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const previousUserIdRef = useRef<string | undefined>(undefined);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Compute total count & subtotal
  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  // Sync to localStorage
  useEffect(() => {
    if (hasInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, hasInitialized]);

  // Fetch cart from backend on mount or when user auth status changes
  const fetchBackendCart = useCallback(async () => {
    if (status === 'loading') return;

    try {
      setLoading(true);
      const sessionId = getOrCreateSessionId();
      const currentUserId = session?.user?.id || session?.user?.email || undefined;

      // Detect account switch
      const isAccountSwitch = previousUserIdRef.current !== undefined && previousUserIdRef.current !== currentUserId;
      previousUserIdRef.current = currentUserId;

      if (isAccountSwitch && typeof window !== 'undefined') {
        // Clear old local cache when switching accounts
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      const res = await fetch(`/api/cart?sessionId=${sessionId}`, {
        headers: { 'x-session-id': sessionId },
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.items) {
        if (data.data.items.length > 0) {
          setItems(data.data.items);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data.items));
          }
        } else {
          // Server cart is empty - authoritative
          setItems([]);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, '[]');
          }
        }
      }
    } catch (err) {
      console.error('Failed to sync cart from backend:', err);
      // Fallback
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch {
            setItems([]);
          }
        }
      }
    } finally {
      setLoading(false);
      setHasInitialized(true);
    }
  }, [status, session?.user]);

  useEffect(() => {
    fetchBackendCart();
  }, [fetchBackendCart]);

  // Add Item to Cart
  const addToCart = async (input: AddToCartInput) => {
    const targetSize = input.size || 'M';
    const targetColor = input.color || 'Standard';
    const addQty = input.quantity || 1;
    const tempId = `${input.slug}-${targetSize}-${targetColor}`;

    // Optimistic UI update
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.slug === input.slug &&
          i.size.toLowerCase() === targetSize.toLowerCase() &&
          i.color.toLowerCase() === targetColor.toLowerCase()
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
        };
      } else {
        updated = [
          ...prev,
          {
            id: tempId,
            productId: input.productId || input.slug,
            slug: input.slug,
            name: input.name,
            image: input.image || '/image1.jpg',
            price: input.price,
            color: targetColor,
            size: targetSize,
            quantity: addQty,
          },
        ];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    // Auto open drawer to confirm addition to customer
    setIsCartOpen(true);

    // Sync with backend API
    try {
      const sessionId = getOrCreateSessionId();
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
        body: JSON.stringify({
          productId: input.productId,
          slug: input.slug,
          name: input.name,
          image: input.image,
          price: input.price,
          color: targetColor,
          size: targetSize,
          quantity: addQty,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.items) {
        setItems(data.data.items);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data.items));
        }
      }
    } catch (err) {
      console.error('Error syncing add-to-cart with server:', err);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    // Optimistic update
    setItems((prev) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prev.filter(
          (i) =>
            i.id !== itemId &&
            `${i.slug}-${i.size}-${i.color}`.toLowerCase() !== itemId.toLowerCase()
        );
      } else {
        updated = prev.map((i) => {
          if (
            i.id === itemId ||
            `${i.slug}-${i.size}-${i.color}`.toLowerCase() === itemId.toLowerCase()
          ) {
            return { ...i, quantity };
          }
          return i;
        });
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    // Sync with backend
    try {
      const sessionId = getOrCreateSessionId();
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.items) {
        setItems(data.data.items);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data.items));
        }
      }
    } catch (err) {
      console.error('Error syncing update-quantity with server:', err);
    }
  };

  // Remove item
  const removeItem = async (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter(
        (i) =>
          i.id !== itemId &&
          `${i.slug}-${i.size}-${i.color}`.toLowerCase() !== itemId.toLowerCase()
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const sessionId = getOrCreateSessionId();
      const res = await fetch(`/api/cart?itemId=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
        headers: { 'x-session-id': sessionId },
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.items) {
        setItems(data.data.items);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data.items));
        }
      }
    } catch (err) {
      console.error('Error syncing remove-item with server:', err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.setItem(LOCAL_STORAGE_KEY, '[]');
    }

    try {
      const sessionId = getOrCreateSessionId();
      await fetch('/api/cart?clearAll=true', {
        method: 'DELETE',
        headers: { 'x-session-id': sessionId },
      });
    } catch (err) {
      console.error('Error syncing clear-cart with server:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        loading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
