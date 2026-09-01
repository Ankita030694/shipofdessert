'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { useCart } from '@/context/CartContext';

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  colors: string[];
}

interface ProductData {
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
  image?: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  fabric?: string;
  care?: string;
  details?: string[];
  relatedProducts?: RelatedProduct[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('/image1.jpg');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const [expandedSection, setExpandedSection] = useState<'details' | 'care' | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.images && data.data.images.length > 0) {
            setSelectedImage(data.data.images[0]);
          }
          if (data.data.colors && data.data.colors.length > 0) {
            setSelectedColor(data.data.colors[0]);
          }
          if (data.data.sizes && data.data.sizes.length > 0) {
            setSelectedSize(data.data.sizes[0]);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    const chosenColor = selectedColor || product.colors?.[0] || 'Standard';
    const chosenSize = selectedSize || product.sizes?.[0] || 'M';

    setAdded(true);
    await addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedImage || product.images?.[0] || product.image || '/image1.jpg',
      price: product.price,
      color: chosenColor,
      size: chosenSize,
      quantity: 1,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-xs uppercase tracking-widest text-[#1c1c1a]/60">
            Loading garment details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <h1 className="text-xl font-serif uppercase tracking-wider mb-2">Product Not Found</h1>
          <p className="text-xs text-[#1c1c1a]/60 mb-6">
            The requested piece could not be located in our current collection.
          </p>
          <Link
            href="/collection"
            className="text-xs uppercase tracking-widest border-b border-[#1c1c1a] pb-0.5 hover:opacity-60"
          >
            Return to Collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 flex-1">
        {/* Breadcrumb */}
        <div className="text-[11px] uppercase tracking-widest text-[#1c1c1a]/50 mb-8">
          <Link href="/collection" className="hover:text-[#1c1c1a]">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-[#1c1c1a]">{product.name}</span>
        </div>

        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 mb-24">
          {/* Left side - Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-[3/4] w-16 sm:w-20 bg-[#e8e4dc]/40 border transition-all cursor-pointer flex-shrink-0 ${
                    selectedImage === img ? 'border-[#1c1c1a]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    unoptimized={Boolean(img?.startsWith('data:'))}
                    className="object-cover object-center"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Center - Main Feature Image */}
          <div className="flex-1 relative aspect-[3/4] max-h-[750px] bg-[#e8e4dc]/30 rounded-sm overflow-hidden order-1 lg:order-2">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              unoptimized={Boolean(selectedImage?.startsWith('data:'))}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right side - Product Details & Purchase Form */}
          <div className="w-full lg:w-96 flex flex-col justify-between order-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-1">
                {product.collectionName}
              </span>
              <h1 className="text-xl sm:text-2xl font-serif text-[#1c1c1a] font-normal tracking-wide mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-base font-light text-[#1c1c1a]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-[#1c1c1a]/50 line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {product.inStock ? (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5">
                    Made to Order
                  </span>
                )}
              </div>

              {/* Color selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-[#1c1c1a] mb-2">
                    <span className="uppercase tracking-wider">Color</span>
                    <span className="text-[#1c1c1a]/70 font-light">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs px-3 py-1.5 border transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white'
                            : 'border-[#1c1c1a]/20 bg-transparent text-[#1c1c1a] hover:border-[#1c1c1a]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2 text-xs text-[#1c1c1a]">
                    <span className="uppercase tracking-wider">Select Size</span>
                    <button className="underline text-[#1c1c1a]/60 hover:text-[#1c1c1a] cursor-pointer">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white'
                            : 'border-[#1c1c1a]/20 text-[#1c1c1a] hover:border-[#1c1c1a]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1c1c1a] text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#333330] transition-colors cursor-pointer mb-6"
              >
                {added ? 'Added to Bag ✓' : 'Add to Shopping Bag'}
              </button>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#1c1c1a]/80 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Accordions */}
              <div className="border-t border-[#dcd8cf] divide-y divide-[#dcd8cf] text-xs">
                {product.fabric && (
                  <div className="py-3.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
                      className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider cursor-pointer"
                    >
                      <span>Fabric & Craft</span>
                      <span>{expandedSection === 'details' ? '−' : '+'}</span>
                    </button>
                    {expandedSection === 'details' && (
                      <div className="mt-2 text-[#1c1c1a]/70 space-y-1 pt-1 leading-relaxed">
                        <p>{product.fabric}</p>
                        {product.details?.map((d, i) => (
                          <p key={i}>• {d}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {product.care && (
                  <div className="py-3.5">
                    <button
                      onClick={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                      className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider cursor-pointer"
                    >
                      <span>Care Instructions</span>
                      <span>{expandedSection === 'care' ? '−' : '+'}</span>
                    </button>
                    {expandedSection === 'care' && (
                      <div className="mt-2 text-[#1c1c1a]/70 pt-1 leading-relaxed">
                        <p>{product.care}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="border-t border-[#dcd8cf] pt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1c1c1a] mb-8 text-center sm:text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {product.relatedProducts.map((rel) => (
                <div key={rel.id} className="group">
                  <Link href={`/product/${rel.slug}`}>
                    <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden">
                      <Image
                        src={rel.image || '/image1.jpg'}
                        alt={rel.name}
                        fill
                        unoptimized={Boolean(rel.image?.startsWith('data:'))}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <h3 className="font-normal text-[#1c1c1a] group-hover:opacity-60 transition-opacity">
                        {rel.name}
                      </h3>
                      <span className="text-[#1c1c1a]/80 ml-2">₹{rel.price.toLocaleString()}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
