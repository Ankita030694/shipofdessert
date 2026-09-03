'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface SetPieces {
  isSet: boolean;
  topName?: string;
  topPrice?: number;
  bottomName?: string;
  bottomPrice?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  colors: string[];
  category: string;
  collectionName: string;
  setPieces?: SetPieces;
}

const CATEGORIES = ['All', 'Sets', 'Tops', 'Dresses', 'Skirts', 'Pants', 'Footwear'];

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const productsPerPage = 12;

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl && CATEGORIES.map(c => c.toLowerCase()).includes(catFromUrl.toLowerCase())) {
      const match = CATEGORIES.find(c => c.toLowerCase() === catFromUrl.toLowerCase()) || 'All';
      setSelectedCategory(match);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const url =
          selectedCategory === 'All'
            ? '/api/products'
            : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load collection products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  // Calculate pagination values
  const totalPages = Math.ceil(products.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <main className="pt-24 flex-1">
      {/* Filters and View Options */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-[#dcd8cf] pb-4 gap-4">
          {/* Left side - Category and Items count */}
          <div className="flex items-center gap-3 text-[#1c1c1a]">
            <h1 className="text-xl font-light font-serif uppercase tracking-wider">
              The Collection
            </h1>
            <span className="text-sm text-[#bdb2a1]">•</span>
            <span className="text-xs uppercase tracking-widest text-[#1c1c1a]/60">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* Category Filter Pills (Now including SETS) */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`text-xs uppercase tracking-widest px-3.5 py-1.5 border transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#1c1c1a] text-white border-[#1c1c1a] shadow-xs font-medium'
                    : 'bg-transparent text-[#1c1c1a] border-[#1c1c1a]/20 hover:border-[#1c1c1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
            Loading collection...
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="py-24 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
            No products found in {selectedCategory}.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentProducts.map((product) => {
              const isSet =
                product.category?.toLowerCase() === 'sets' || Boolean(product.setPieces?.isSet);

              return (
                <div key={product.id} className="group mb-4">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden">
                      <Image
                        src={product.image || '/image1.jpg'}
                        alt={product.name}
                        fill
                        unoptimized={Boolean(product.image?.startsWith('data:'))}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {isSet && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="bg-[#1c1c1a]/90 text-white text-[9px] uppercase px-2 py-0.5 tracking-widest font-mono font-medium backdrop-blur-xs">
                            Set
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs sm:text-sm font-normal text-[#1c1c1a] group-hover:opacity-60 transition-opacity">
                          {product.name}
                        </h3>
                        {isSet && (
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            2-Piece Ensemble
                          </span>
                        )}
                      </div>
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
                                  : color.toLowerCase(),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 mb-12">
            <div className="flex gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 border border-[#1c1c1a]/20 text-xs uppercase tracking-wider text-[#1c1c1a] hover:border-[#1c1c1a] cursor-pointer"
                >
                  Previous
                </button>
              )}

              {pageNumbers.map((number) => (
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
      </div>
    </main>
  );
}

export default function CollectionPage() {
  return (
    <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />
      <Suspense
        fallback={
          <div className="pt-32 pb-24 text-center text-xs uppercase tracking-widest text-[#1c1c1a]/60">
            Loading collection...
          </div>
        }
      >
        <CollectionContent />
      </Suspense>
      <Footer />
    </div>
  );
}
