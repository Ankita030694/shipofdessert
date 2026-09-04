'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  image: string;
  images: string[];
  colors: string[];
  category: string;
  collectionName: string;
  inStock?: boolean;
}

const FALLBACK_DRESSES = [
  {
    id: '1',
    name: 'Gathered Silk Dress',
    slug: 'gathered-silk-dress',
    price: 1650,
    currency: 'INR',
    image: '/image1.jpg',
    images: ['/image1.jpg'],
    colors: ['Stone', 'Ecru'],
    category: 'Dresses',
    collectionName: 'The Inheritance 01',
  },
  {
    id: '2',
    name: 'Pleated Linen Slip Dress',
    slug: 'pleated-linen-slip-dress',
    price: 1420,
    currency: 'INR',
    image: '/image2.jpg',
    images: ['/image2.jpg'],
    colors: ['White', 'Sand'],
    category: 'Dresses',
    collectionName: 'The Inheritance 01',
  },
  {
    id: '3',
    name: 'Structured Wool Column Dress',
    slug: 'structured-wool-column-dress',
    price: 1890,
    currency: 'INR',
    image: '/image3.jpg',
    images: ['/image3.jpg'],
    colors: ['Black', 'Slate'],
    category: 'Dresses',
    collectionName: 'The Inheritance 01',
  },
];

export default function DressesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDresses() {
      try {
        setLoading(true);
        const res = await fetch('/api/products?category=Dresses');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
        } else {
          setProducts(FALLBACK_DRESSES);
        }
      } catch (err) {
        console.error('Failed to load dresses:', err);
        setProducts(FALLBACK_DRESSES);
      } finally {
        setLoading(false);
      }
    }
    loadDresses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-[#dcd8cf] pb-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-[#bdb2a1] mb-2">
              <Link href="/women" className="hover:text-[#1c1c1a]">Women</Link> / <span>Dresses</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-light tracking-wide uppercase font-serif">
              Dresses
            </h1>
          </div>
          <span className="text-xs text-[#1c1c1a]/60 uppercase tracking-widest">
            {products.length} {products.length === 1 ? 'Selection' : 'Selections'}
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#1c1c1a] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs uppercase tracking-widest text-[#1c1c1a]/60">
              Loading dresses...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/product/${item.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#dcd8cf]/30 mb-4">
                    <Image
                      src={item.image || (item.images && item.images[0]) || '/image1.jpg'}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex justify-between items-start text-xs sm:text-sm">
                    <h2 className="font-normal uppercase tracking-wider">{item.name}</h2>
                    <span className="font-light">₹{item.price.toLocaleString()}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
