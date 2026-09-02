'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

interface CompanionItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
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
  featured?: boolean;
  
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
  
  // Companion & Related
  completeTheSet?: string[];
  companionItems?: CompanionItem[];
  relatedProducts?: RelatedProduct[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('/image1.jpg');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    'description' | 'fabric' | 'fit' | 'details' | 'care' | null
  >('details');

  const { addToCart } = useCart();

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
      image: selectedImage || product.images?.[0] || '/image1.jpg',
      price: product.price,
      color: chosenColor,
      size: chosenSize,
      quantity: 1,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    const chosenColor = selectedColor || product.colors?.[0] || 'Standard';
    const chosenSize = selectedSize || product.sizes?.[0] || 'M';

    await addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedImage || product.images?.[0] || '/image1.jpg',
      price: product.price,
      color: chosenColor,
      size: chosenSize,
      quantity: 1,
    });

    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-xs uppercase tracking-widest text-[#1c1c1a]/60 animate-pulse">
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

  const designPointers =
    product.designDetails && product.designDetails.length > 0
      ? product.designDetails
      : product.details && product.details.length > 0
      ? product.details
      : [
          'Relaxed architectural silhouette with dropped shoulder seam',
          'Naturally breathable handloom weave',
          'Concealed French interior seams for longevity',
          'Handcrafted ethically by master artisans in Rajasthan',
        ];

  return (
    <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 flex-1 max-w-7xl">
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

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-24 items-start">
          {/* Left Column: Image Thumbnails + Main Showcase (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            {/* Thumbnail Column */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 flex-shrink-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-[3/4] w-16 sm:w-20 bg-[#e8e4dc]/40 border transition-all cursor-pointer flex-shrink-0 ${
                      selectedImage === img
                        ? 'border-[#1c1c1a] ring-1 ring-[#1c1c1a]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      unoptimized={Boolean(img?.startsWith('data:'))}
                      className="object-cover object-center"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Showcase Image */}
            <div className="flex-1 relative aspect-[3/4] bg-[#e8e4dc]/30 rounded-xs overflow-hidden order-1 sm:order-2 border border-[#1c1c1a]/10 max-h-[780px]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                unoptimized={Boolean(selectedImage?.startsWith('data:'))}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>

          {/* Right Column: Product Details & Buying Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Brand & Collection Badge */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-1">
                {product.collectionName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#1c1c1a] font-normal tracking-wide mb-2">
                {product.name}
              </h1>

              {/* Product Rating */}
              <div className="flex items-center gap-2 text-xs mb-3">
                <div className="flex items-center text-amber-700">
                  <span>★</span>
                  <span className="font-semibold ml-1">{product.rating || 4.9}</span>
                </div>
                <span className="text-stone-400">•</span>
                <span className="text-[#1c1c1a]/60 underline cursor-pointer hover:text-[#1c1c1a]">
                  ({product.reviewsCount || 18} Verified Reviews)
                </span>
              </div>

              {/* Price + Inclusive of Taxes Note */}
              <div className="border-b border-[#dcd8cf] pb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-serif font-light text-[#1c1c1a]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-[#1c1c1a]/40 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 ml-auto">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 ml-auto">
                      Made to Order
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#1c1c1a]/60 font-light mt-1">
                  Inclusive of all taxes. Complimentary express shipping across India.
                </p>
              </div>
            </div>

            {/* Short Fit Note & Model Stats */}
            {product.fitNote && (
              <div className="bg-[#f9f9f9] border border-[#1c1c1a]/10 p-3 rounded-xs flex items-center gap-2.5 text-xs text-[#1c1c1a]/80">
                <span className="text-sm">📏</span>
                <div>
                  <span className="font-medium text-[#1c1c1a]">{product.fitNote}</span>
                  {product.modelStats && product.modelStats !== product.fitNote && (
                    <span className="text-[11px] text-[#1c1c1a]/60 block mt-0.5">
                      {product.modelStats}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Colour Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex justify-between text-xs text-[#1c1c1a] mb-2.5">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">
                    Colour : <strong className="text-[#1c1c1a] font-normal">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3.5 py-1.5 border transition-all cursor-pointer ${
                        selectedColor === color
                          ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white'
                          : 'border-[#1c1c1a]/20 bg-white text-[#1c1c1a] hover:border-[#1c1c1a]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector & Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2.5 text-xs text-[#1c1c1a]">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="underline text-[#1c1c1a]/70 hover:text-[#1c1c1a] cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <span>📐</span>
                    <span>Size Guide & Measurements</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs uppercase tracking-wider border transition-all cursor-pointer font-mono ${
                        selectedSize === size
                          ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white'
                          : 'border-[#1c1c1a]/20 bg-white text-[#1c1c1a] hover:border-[#1c1c1a]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart + Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1c1c1a] text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#333330] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{added ? 'Added to Bag ✓' : 'Add to Shopping Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full border border-[#1c1c1a] text-[#1c1c1a] py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#1c1c1a] hover:text-white transition-colors cursor-pointer text-center block"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Signals Section */}
            <div className="bg-white border border-[#1c1c1a]/10 p-4 rounded-xs divide-y divide-[#1c1c1a]/10 text-xs text-[#1c1c1a]/80 space-y-2.5">
              <div className="flex items-center gap-3 pt-1 first:pt-0">
                <span className="text-base">🚚</span>
                <div>
                  <span className="font-semibold text-[#1c1c1a]">Estimated Delivery</span>
                  <p className="text-[11px] text-[#1c1c1a]/60">
                    Dispatches in 24 hours · {product.estimatedDelivery || '3–5 Business Days'}
                  </p>
                </div>
              </div>

              {product.codAvailable !== false && (
                <div className="flex items-center gap-3 pt-2.5">
                  <span className="text-base">💵</span>
                  <div>
                    <span className="font-semibold text-[#1c1c1a]">Cash on Delivery (COD)</span>
                    <p className="text-[11px] text-[#1c1c1a]/60">
                      Available for all domestic orders across India.
                    </p>
                  </div>
                </div>
              )}

              {product.freeShipping !== false && (
                <div className="flex items-center gap-3 pt-2.5">
                  <span className="text-base">📦</span>
                  <div>
                    <span className="font-semibold text-[#1c1c1a]">Complimentary Express Shipping</span>
                    <p className="text-[11px] text-[#1c1c1a]/60">
                      Zero shipping charges on all prepaid orders.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2.5">
                <span className="text-base">🔄</span>
                <div>
                  <span className="font-semibold text-[#1c1c1a]">Hassle-Free Returns</span>
                  <p className="text-[11px] text-[#1c1c1a]/60">
                    {product.easyReturns || '7-Day Complimentary Returns & Exchanges'}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Narrative & Detail Accordions */}
            <div className="border-t border-[#dcd8cf] divide-y divide-[#dcd8cf] text-xs pt-2">
              {/* Description */}
              <div className="py-3.5">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'description' ? null : 'description')
                  }
                  className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <span>Description & Silhouette</span>
                  <span>{expandedSection === 'description' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'description' && (
                  <div className="mt-2.5 text-[#1c1c1a]/80 leading-relaxed pt-1">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* Fabric & Feel */}
              {product.fabric && (
                <div className="py-3.5">
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === 'fabric' ? null : 'fabric')
                    }
                    className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <span>Fabric & Feel</span>
                    <span>{expandedSection === 'fabric' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'fabric' && (
                    <div className="mt-2.5 text-[#1c1c1a]/80 leading-relaxed pt-1">
                      <p>{product.fabric}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Fit */}
              {product.fit && (
                <div className="py-3.5">
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === 'fit' ? null : 'fit')
                    }
                    className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <span>Fit & Tailoring</span>
                    <span>{expandedSection === 'fit' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'fit' && (
                    <div className="mt-2.5 text-[#1c1c1a]/80 leading-relaxed pt-1">
                      <p>{product.fit}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Design Details (Pointers) */}
              <div className="py-3.5">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'details' ? null : 'details')
                  }
                  className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <span>Design Details</span>
                  <span>{expandedSection === 'details' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'details' && (
                  <div className="mt-2.5 text-[#1c1c1a]/80 space-y-1.5 pt-1 leading-relaxed">
                    {designPointers.map((detail, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-[#1c1c1a]/40">•</span>
                        <span>{detail}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Wash Care */}
              {product.care && (
                <div className="py-3.5">
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === 'care' ? null : 'care')
                    }
                    className="flex justify-between items-center w-full text-[#1c1c1a] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    <span>Wash Care</span>
                    <span>{expandedSection === 'care' ? '−' : '+'}</span>
                  </button>
                  {expandedSection === 'care' && (
                    <div className="mt-2.5 text-[#1c1c1a]/80 leading-relaxed pt-1">
                      <p>{product.care}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete the Set / Pair With Section */}
        {product.companionItems && product.companionItems.length > 0 && (
          <div className="border-t border-[#dcd8cf] pt-14 mb-20">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-1">
                  Styling Curation
                </span>
                <h2 className="text-xl sm:text-2xl font-serif text-[#1c1c1a] uppercase tracking-wide">
                  Complete The Set
                </h2>
              </div>
              <p className="text-xs text-[#1c1c1a]/60 mt-1 sm:mt-0">
                Considered combinations designed to be worn together.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {product.companionItems.map((comp) => (
                <div key={comp.id} className="group">
                  <Link href={`/product/${comp.slug}`}>
                    <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden border border-[#1c1c1a]/10">
                      <Image
                        src={comp.image || '/image1.jpg'}
                        alt={comp.name}
                        fill
                        unoptimized={Boolean(comp.image?.startsWith('data:'))}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="text-xs">
                      <h3 className="font-normal text-[#1c1c1a] group-hover:opacity-60 transition-opacity">
                        {comp.name}
                      </h3>
                      <span className="text-[#1c1c1a]/80 mt-1 block">
                        ₹{comp.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden border border-[#1c1c1a]/10">
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

      {/* ========================================================================= */}
      {/* INTERACTIVE SIZE GUIDE MODAL */}
      {/* ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-sm border border-[#1c1c1a]/20 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#1c1c1a]/10 pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#bdb2a1] font-bold">
                  KSHAUM Fit Standard
                </span>
                <h2 className="text-xl font-serif text-[#1c1c1a] mt-1">
                  Size Guide & Garment Measurements
                </h2>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-lg leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-xs text-[#1c1c1a]/80">
              <p className="text-xs text-[#1c1c1a]/70 leading-relaxed">
                All measurements are in <strong className="text-[#1c1c1a]">inches</strong> and represent the actual garment dimensions laid flat. Compare these with your own measurements or a favorite garment for your preferred fit.
              </p>

              {/* Garment Measurements Table */}
              <div className="overflow-x-auto border border-[#1c1c1a]/15 rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f9f9] border-b border-[#1c1c1a]/15 uppercase tracking-widest text-[#1c1c1a] text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3.5">Size</th>
                      <th className="py-2.5 px-3.5">Chest (in)</th>
                      <th className="py-2.5 px-3.5">Shoulder (in)</th>
                      <th className="py-2.5 px-3.5">Length (in)</th>
                      <th className="py-2.5 px-3.5">Sleeve (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1a]/10 font-mono">
                    <tr className="hover:bg-stone-50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">XS</td>
                      <td className="py-2 px-3.5">38.0</td>
                      <td className="py-2 px-3.5">17.5</td>
                      <td className="py-2 px-3.5">27.0</td>
                      <td className="py-2 px-3.5">24.5</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">S</td>
                      <td className="py-2 px-3.5">40.0</td>
                      <td className="py-2 px-3.5">18.0</td>
                      <td className="py-2 px-3.5">27.5</td>
                      <td className="py-2 px-3.5">25.0</td>
                    </tr>
                    <tr className="hover:bg-stone-50 bg-[#f9f9f9]/50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">M (Sample)</td>
                      <td className="py-2 px-3.5">42.0</td>
                      <td className="py-2 px-3.5">18.5</td>
                      <td className="py-2 px-3.5">28.0</td>
                      <td className="py-2 px-3.5">25.5</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">L</td>
                      <td className="py-2 px-3.5">44.0</td>
                      <td className="py-2 px-3.5">19.0</td>
                      <td className="py-2 px-3.5">28.5</td>
                      <td className="py-2 px-3.5">26.0</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">XL</td>
                      <td className="py-2 px-3.5">46.5</td>
                      <td className="py-2 px-3.5">19.5</td>
                      <td className="py-2 px-3.5">29.0</td>
                      <td className="py-2 px-3.5">26.5</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="py-2 px-3.5 font-sans font-semibold text-[#1c1c1a]">XXL</td>
                      <td className="py-2 px-3.5">49.0</td>
                      <td className="py-2 px-3.5">20.0</td>
                      <td className="py-2 px-3.5">29.5</td>
                      <td className="py-2 px-3.5">27.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* How to Measure Guide */}
              <div className="bg-[#f9f9f9] p-4 rounded-xs border border-[#1c1c1a]/10 space-y-2">
                <h4 className="font-semibold uppercase tracking-wider text-[11px] text-[#1c1c1a]">
                  How to Measure
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#1c1c1a]/75 leading-relaxed">
                  <li>
                    <strong className="text-[#1c1c1a]">1. Chest:</strong> Measure straight across the fullest part of the chest, 1 inch below the armhole.
                  </li>
                  <li>
                    <strong className="text-[#1c1c1a]">2. Shoulder:</strong> Measure horizontally from one shoulder seam point to the other across the back.
                  </li>
                  <li>
                    <strong className="text-[#1c1c1a]">3. Length:</strong> Measure vertically from the highest shoulder point next to the collar down to the bottom hem.
                  </li>
                  <li>
                    <strong className="text-[#1c1c1a]">4. Sleeve:</strong> Measure from the shoulder seam point down to the edge of the cuff.
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-6 py-2.5 bg-[#1c1c1a] text-white text-xs uppercase tracking-wider hover:bg-[#333330] cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
