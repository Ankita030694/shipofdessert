'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

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

const WOMEN_CATEGORIES = [
  { label: 'All Women', value: 'All' },
  { label: 'Dresses', value: 'Dresses' },
  { label: 'Skirts', value: 'Skirts' },
  { label: 'Tops', value: 'Tops' },
  { label: 'Trousers', value: 'Pants' },
  { label: 'Footwear', value: 'Footwear' },
];

function WomenContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Sync category from URL
  useEffect(() => {
    if (urlCategory) {
      const match = WOMEN_CATEGORIES.find(
        (c) =>
          c.value.toLowerCase() === urlCategory.toLowerCase() ||
          c.label.toLowerCase() === urlCategory.toLowerCase()
      );
      if (match) {
        setSelectedCategory(match.value);
      } else {
        setSelectedCategory(urlCategory);
      }
    } else {
      setSelectedCategory('All');
    }
  }, [urlCategory]);

  // Load products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }
        if (urlSearch) {
          params.set('search', urlSearch);
        }
        if (sortOption) {
          params.set('sort', sortOption);
        }

        const queryString = params.toString();
        const url = queryString ? `/api/products?${queryString}` : '/api/products';

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load women products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, urlSearch, sortOption]);

  // Pagination calculation
  const totalPages = Math.ceil(products.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveCategoryLabel = () => {
    const found = WOMEN_CATEGORIES.find((c) => c.value === selectedCategory);
    return found ? found.label : selectedCategory;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f5] text-[#1c1c1a]">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Editorial Header */}
        <div className="text-center py-6 sm:py-8 border-b border-[#dcd8cf]">
          <span className="text-xs uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-2">
            Women’s Collection &amp; Silhouette
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide uppercase font-serif">
            {selectedCategory === 'All' ? 'All Women' : getActiveCategoryLabel()}
          </h1>
          <p className="text-xs sm:text-sm font-light tracking-wide text-[#1c1c1a]/70 mt-2 max-w-lg mx-auto">
            Understated elegance, fluid draping, and considered forms designed to move effortlessly with the body.
          </p>
        </div>

        {/* Filter and Control Bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#dcd8cf] mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {WOMEN_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setCurrentPage(1);
                }}
                className={`text-xs uppercase tracking-widest px-3.5 py-1.5 border transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.value.toLowerCase()
                    ? 'bg-[#1c1c1a] text-white border-[#1c1c1a]'
                    : 'bg-transparent text-[#1c1c1a] border-[#1c1c1a]/20 hover:border-[#1c1c1a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Sort & Count */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#1c1c1a]/60 uppercase tracking-widest">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>

            <div className="flex items-center gap-1.5">
              <label htmlFor="women-sort" className="uppercase tracking-wider text-[#1c1c1a]/60 hidden sm:inline">
                Sort:
              </label>
              <select
                id="women-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border border-[#dcd8cf] px-2.5 py-1 text-xs uppercase tracking-wider text-[#1c1c1a] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-6 h-6 border-2 border-[#1c1c1a] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs uppercase tracking-widest text-[#1c1c1a]/60">
              Loading collection...
            </p>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-xs uppercase tracking-widest text-[#1c1c1a]/60 mb-4">
              No products found in this category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs uppercase tracking-wider underline text-[#1c1c1a] hover:opacity-75 cursor-pointer"
            >
              View All Women
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentProducts.map((product) => (
              <div key={product.id} className="group mb-4">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden">
                    <Image
                      src={product.image || (product.images && product.images[0]) || '/image1.jpg'}
                      alt={product.name}
                      fill
                      unoptimized={Boolean(product.image?.startsWith('data:'))}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {product.inStock === false && (
                      <span className="absolute top-2 left-2 bg-[#1c1c1a]/80 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 backdrop-blur-sm">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xs sm:text-sm font-normal text-[#1c1c1a] group-hover:opacity-60 transition-opacity">
                      {product.name}
                    </h2>
                    <span className="text-xs sm:text-sm text-[#1c1c1a] font-light ml-2 whitespace-nowrap">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          title={color}
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === 'stone'
                                ? '#dcd8cf'
                                : color.toLowerCase() === 'sand'
                                ? '#bdb2a1'
                                : color.toLowerCase() === 'slate'
                                ? '#a3b2bf'
                                : color.toLowerCase() === 'off-white' || color.toLowerCase() === 'white'
                                ? '#ffffff'
                                : color.toLowerCase() === 'charcoal'
                                ? '#333333'
                                : color.toLowerCase() === 'ecru'
                                ? '#f3eee3'
                                : color.toLowerCase(),
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 border border-[#1c1c1a]/20 text-xs uppercase tracking-wider text-[#1c1c1a] hover:border-[#1c1c1a] cursor-pointer"
                >
                  Previous
                </button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-4 py-2 text-xs border transition-colors cursor-pointer ${
                    currentPage === number
                      ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white'
                      : 'border-[#1c1c1a]/20 text-[#1c1c1a] hover:border-[#1c1c1a]'
                  }`}
                >
                  {number}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 border border-[#1c1c1a]/20 text-xs uppercase tracking-wider text-[#1c1c1a] hover:border-[#1c1c1a] cursor-pointer"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function WomenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="inline-block w-6 h-6 border-2 border-[#1c1c1a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WomenContent />
    </Suspense>
  );
}
