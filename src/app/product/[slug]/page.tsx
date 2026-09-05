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

export interface ClassifiedImage {
  url: string;
  tag: 'full_set' | 'top' | 'bottom' | 'detail' | 'general';
  caption?: string;
  sortOrder?: number;
}

export interface SetPieces {
  isSet: boolean;
  topName?: string;
  topPrice?: number;
  bottomName?: string;
  bottomPrice?: number;
  additionalName?: string;
  additionalPrice?: number;
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
  classifiedImages?: ClassifiedImage[];
  setPieces?: SetPieces;
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
  const [selectedPieceOption, setSelectedPieceOption] = useState<'full' | 'top' | 'bottom' | 'additional'>('full');
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

  // Set-Specific Computed Properties
  const isSet = product?.category?.toLowerCase() === 'sets' || Boolean(product?.setPieces?.isSet);
  const topName = product?.setPieces?.topName?.trim() || 'Top / Upper Piece';
  const bottomName = product?.setPieces?.bottomName?.trim() || 'Skirt / Trouser';
  const additionalName = product?.setPieces?.additionalName?.trim() || '';

  // Smart Individual Price Fallbacks
  const rawTopPrice = product?.setPieces?.topPrice;
  const rawBottomPrice = product?.setPieces?.bottomPrice;
  const rawAdditionalPrice = product?.setPieces?.additionalPrice;

  const defaultTopPrice =
    rawTopPrice && rawTopPrice > 0
      ? rawTopPrice
      : product
      ? Math.round(product.price * 0.48)
      : 0;

  const defaultBottomPrice =
    rawBottomPrice && rawBottomPrice > 0
      ? rawBottomPrice
      : product
      ? product.price - defaultTopPrice
      : 0;

  const defaultAdditionalPrice = rawAdditionalPrice || 0;

  // Active Price based on selected piece
  const activePrice = !isSet || selectedPieceOption === 'full'
    ? product?.price || 0
    : selectedPieceOption === 'top'
    ? defaultTopPrice
    : selectedPieceOption === 'bottom'
    ? defaultBottomPrice
    : defaultAdditionalPrice;

  const handleSelectPiece = (option: 'full' | 'top' | 'bottom' | 'additional') => {
    setSelectedPieceOption(option);

    if (!product) return;

    if (option === 'top') {
      const topImg = product.classifiedImages?.find((c) => c.tag === 'top')?.url;
      if (topImg) setSelectedImage(topImg);
    } else if (option === 'bottom') {
      const bottomImg = product.classifiedImages?.find((c) => c.tag === 'bottom')?.url;
      if (bottomImg) setSelectedImage(bottomImg);
    } else if (option === 'full') {
      const fullImg =
        product.classifiedImages?.find((c) => c.tag === 'full_set')?.url || product.images?.[0];
      if (fullImg) setSelectedImage(fullImg);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const chosenColor = selectedColor || product.colors?.[0] || 'Standard';
    const chosenSize = selectedSize || product.sizes?.[0] || 'M';

    const itemName = !isSet || selectedPieceOption === 'full'
      ? `${product.name} (Full Set)`
      : selectedPieceOption === 'top'
      ? `${product.name} — ${topName}`
      : selectedPieceOption === 'bottom'
      ? `${product.name} — ${bottomName}`
      : `${product.name} — ${additionalName}`;

    const itemSlug = !isSet || selectedPieceOption === 'full'
      ? product.slug
      : `${product.slug}-${selectedPieceOption}`;

    let itemImage = selectedImage || product.images?.[0] || '/image1.jpg';
    if (selectedPieceOption === 'top') {
      const topImg = product.classifiedImages?.find((c) => c.tag === 'top')?.url;
      if (topImg) itemImage = topImg;
    } else if (selectedPieceOption === 'bottom') {
      const btmImg = product.classifiedImages?.find((c) => c.tag === 'bottom')?.url;
      if (btmImg) itemImage = btmImg;
    }

    setAdded(true);
    await addToCart({
      productId: product.id,
      slug: itemSlug,
      name: itemName,
      image: itemImage,
      price: activePrice,
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

    const itemName = !isSet || selectedPieceOption === 'full'
      ? `${product.name} (Full Set)`
      : selectedPieceOption === 'top'
      ? `${product.name} — ${topName}`
      : selectedPieceOption === 'bottom'
      ? `${product.name} — ${bottomName}`
      : `${product.name} — ${additionalName}`;

    const itemSlug = !isSet || selectedPieceOption === 'full'
      ? product.slug
      : `${product.slug}-${selectedPieceOption}`;

    let itemImage = selectedImage || product.images?.[0] || '/image1.jpg';
    if (selectedPieceOption === 'top') {
      const topImg = product.classifiedImages?.find((c) => c.tag === 'top')?.url;
      if (topImg) itemImage = topImg;
    } else if (selectedPieceOption === 'bottom') {
      const btmImg = product.classifiedImages?.find((c) => c.tag === 'bottom')?.url;
      if (btmImg) itemImage = btmImg;
    }

    await addToCart({
      productId: product.id,
      slug: itemSlug,
      name: itemName,
      image: itemImage,
      price: activePrice,
      color: chosenColor,
      size: chosenSize,
      quantity: 1,
    });

    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="bg-[#DBD8CF] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
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
      <div className="bg-[#DBD8CF] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
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
    <div className="bg-[#DBD8CF] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
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
                {product.images.map((img, index) => {
                  const classified = (product.classifiedImages || [])[index];
                  const tagLabel =
                    classified?.tag === 'top'
                      ? 'Top'
                      : classified?.tag === 'bottom'
                      ? 'Bottom'
                      : classified?.tag === 'detail'
                      ? 'Detail'
                      : index === 0
                      ? 'Look'
                      : '';

                  return (
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
                      {tagLabel && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-mono px-1 py-0.2 rounded-xs uppercase">
                          {tagLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
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
              {isSet && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1c1c1a] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono font-medium">
                    {selectedPieceOption === 'full'
                      ? 'Full Set Ensemble'
                      : selectedPieceOption === 'top'
                      ? topName
                      : selectedPieceOption === 'bottom'
                      ? bottomName
                      : 'Individual Piece'}
                  </span>
                </div>
              )}
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
                    ₹{activePrice.toLocaleString()}
                  </span>
                  {selectedPieceOption === 'full' && product.compareAtPrice && (
                    <span className="text-sm text-[#1c1c1a]/40 line-through">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 ml-auto font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 ml-auto">
                      Made to Order
                    </span>
                  )}
                </div>

                {isSet && selectedPieceOption !== 'full' ? (
                  <p className="text-[11px] text-amber-800 font-medium mt-1 flex items-center gap-1.5">
                    <span>🏷️</span>
                    <span>
                      Purchasing individual piece: <strong>{selectedPieceOption === 'top' ? topName : bottomName}</strong>
                    </span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#1c1c1a]/60 font-light mt-1">
                    Inclusive of all taxes. Complimentary express shipping across India.
                  </p>
                )}
              </div>
            </div>

            {/* SET PIECE SELECTOR (BUY FULL SET OR SEPARATES) */}
            {isSet && (
              <div className="bg-[#f9f9f9] border border-[#1c1c1a]/15 p-4 rounded-xs space-y-3 shadow-xs">
                <div className="flex justify-between items-center border-b border-[#1c1c1a]/10 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1c1c1a]">
                    Purchase Selection
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                    Buy Ensemble or Separates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Option 1: Full Ensemble */}
                  <button
                    type="button"
                    onClick={() => handleSelectPiece('full')}
                    className={`p-3 text-left border rounded-xs transition-all cursor-pointer relative ${
                      selectedPieceOption === 'full'
                        ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white shadow-xs'
                        : 'border-stone-300 bg-[#DBD8CF] hover:border-[#1c1c1a] text-[#1c1c1a]'
                    }`}
                  >
                    <span
                      className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${
                        selectedPieceOption === 'full' ? 'text-amber-300' : 'text-stone-500'
                      }`}
                    >
                      Full Set
                    </span>
                    <span className="text-xs font-serif font-medium block mt-1">
                      Complete Ensemble
                    </span>
                    <span className="text-xs font-mono font-bold block mt-1">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </button>

                  {/* Option 2: Upper Garment */}
                  <button
                    type="button"
                    onClick={() => handleSelectPiece('top')}
                    className={`p-3 text-left border rounded-xs transition-all cursor-pointer relative ${
                      selectedPieceOption === 'top'
                        ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white shadow-xs'
                        : 'border-stone-300 bg-[#DBD8CF] hover:border-[#1c1c1a] text-[#1c1c1a]'
                    }`}
                  >
                    <span
                      className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${
                        selectedPieceOption === 'top' ? 'text-amber-300' : 'text-stone-500'
                      }`}
                    >
                      Upper Only
                    </span>
                    <span className="text-xs font-serif font-medium block mt-1 truncate" title={topName}>
                      {topName}
                    </span>
                    <span className="text-xs font-mono font-bold block mt-1">
                      ₹{defaultTopPrice.toLocaleString()}
                    </span>
                  </button>

                  {/* Option 3: Lower Garment */}
                  <button
                    type="button"
                    onClick={() => handleSelectPiece('bottom')}
                    className={`p-3 text-left border rounded-xs transition-all cursor-pointer relative ${
                      selectedPieceOption === 'bottom'
                        ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white shadow-xs'
                        : 'border-stone-300 bg-[#DBD8CF] hover:border-[#1c1c1a] text-[#1c1c1a]'
                    }`}
                  >
                    <span
                      className={`text-[9px] uppercase tracking-wider block font-bold font-mono ${
                        selectedPieceOption === 'bottom' ? 'text-amber-300' : 'text-stone-500'
                      }`}
                    >
                      Lower Only
                    </span>
                    <span className="text-xs font-serif font-medium block mt-1 truncate" title={bottomName}>
                      {bottomName}
                    </span>
                    <span className="text-xs font-mono font-bold block mt-1">
                      ₹{defaultBottomPrice.toLocaleString()}
                    </span>
                  </button>
                </div>

                {additionalName && defaultAdditionalPrice > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => handleSelectPiece('additional')}
                      className={`w-full p-2.5 text-left border rounded-xs transition-all cursor-pointer flex justify-between items-center ${
                        selectedPieceOption === 'additional'
                          ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white shadow-xs'
                          : 'border-stone-300 bg-[#DBD8CF] hover:border-[#1c1c1a] text-[#1c1c1a]'
                      }`}
                    >
                      <span className="text-xs font-medium">
                        🧣 Add-on: {additionalName}
                      </span>
                      <span className="text-xs font-mono font-bold">
                        ₹{defaultAdditionalPrice.toLocaleString()}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Short Fit Note & Model Stats */}
            {product.fitNote && (
              <div className="bg-[#DBD8CF]/70 border border-[#1c1c1a]/10 p-3 rounded-xs flex items-center gap-2.5 text-xs text-[#1c1c1a]/80">
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
                          : 'border-[#1c1c1a]/20 bg-[#DBD8CF] text-[#1c1c1a] hover:border-[#1c1c1a]'
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
                    className="underline text-[#1c1c1a]/70 hover:text-[#1c1c1a] cursor-pointer flex items-center gap-1.5 text-[11px]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.3 15.3-7.6-7.6a2.12 2.12 0 0 0-3 0L3 15.4a2.12 2.12 0 0 0 0 3l2.3 2.3a2.12 2.12 0 0 0 3 0l7.7-7.7" />
                      <path d="m14.5 12.5 2-2M11.5 15.5 13 14M8.5 18.5 10 17" />
                    </svg>
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
                          ? 'border-[#1c1c1a] bg-[#1c1c1a] text-white font-bold'
                          : 'border-[#1c1c1a]/20 bg-[#DBD8CF] text-[#1c1c1a] hover:border-[#1c1c1a]'
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
                <span>
                  {added
                    ? 'Added to Bag ✓'
                    : isSet && selectedPieceOption !== 'full'
                    ? `Add ${selectedPieceOption === 'top' ? topName : bottomName} to Bag · ₹${activePrice.toLocaleString()}`
                    : 'Add to Shopping Bag'}
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full border border-[#1c1c1a] text-[#1c1c1a] py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#1c1c1a] hover:text-white transition-colors cursor-pointer text-center block"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Signals Section */}
            <div className="bg-[#DBD8CF] border border-[#1c1c1a]/10 p-4 rounded-xs divide-y divide-[#1c1c1a]/10 text-xs text-[#1c1c1a]/80 space-y-2.5">
              <div className="flex items-center gap-3.5 pt-1 first:pt-0">
                <div className="w-8 h-8 rounded-full bg-[#1c1c1a]/5 border border-[#1c1c1a]/10 flex items-center justify-center flex-shrink-0 text-[#1c1c1a]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-5.28a1 1 0 0 0-.284-.707l-3.432-3.43A1 1 0 0 0 17.576 7H14v11" />
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="17" cy="18" r="2" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-[#1c1c1a]">Estimated Delivery</span>
                  <p className="text-[11px] text-[#1c1c1a]/60">
                    Dispatches in 24 hours · {product.estimatedDelivery || '3–5 Business Days'}
                  </p>
                </div>
              </div>

              {product.codAvailable !== false && (
                <div className="flex items-center gap-3.5 pt-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1c1c1a]/5 border border-[#1c1c1a]/10 flex items-center justify-center flex-shrink-0 text-[#1c1c1a]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="12" x="2" y="6" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M6 12h.01M18 12h.01" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1c1c1a]">Cash on Delivery (COD)</span>
                    <p className="text-[11px] text-[#1c1c1a]/60">
                      Available for all domestic orders across India.
                    </p>
                  </div>
                </div>
              )}

              {product.freeShipping !== false && (
                <div className="flex items-center gap-3.5 pt-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1c1c1a]/5 border border-[#1c1c1a]/10 flex items-center justify-center flex-shrink-0 text-[#1c1c1a]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1c1c1a]">Complimentary Express Shipping</span>
                    <p className="text-[11px] text-[#1c1c1a]/60">
                      Zero shipping charges on all prepaid orders.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3.5 pt-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1c1c1a]/5 border border-[#1c1c1a]/10 flex items-center justify-center flex-shrink-0 text-[#1c1c1a]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-[#1c1c1a]">Hassle-Free Returns</span>
                  <p className="text-[11px] text-[#1c1c1a]/60">
                    {product.easyReturns || '7-Day Complimentary Returns & Exchanges'}
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Accordion Tabs */}
            <div className="border-t border-[#dcd8cf] pt-4 divide-y divide-[#dcd8cf] text-xs">
              {/* 1. Description */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'description' ? null : 'description')
                  }
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#1c1c1a] cursor-pointer"
                >
                  <span>Editorial Description</span>
                  <span>{expandedSection === 'description' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'description' && (
                  <div className="pt-3 text-[#1c1c1a]/80 leading-relaxed font-light">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* 2. Fabric & Material */}
              <div className="py-3">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'fabric' ? null : 'fabric')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#1c1c1a] cursor-pointer"
                >
                  <span>Fabric & Drape</span>
                  <span>{expandedSection === 'fabric' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'fabric' && (
                  <div className="pt-3 text-[#1c1c1a]/80 leading-relaxed font-light">
                    <p>{product.fabric || '100% Handcrafted Natural Fiber.'}</p>
                  </div>
                )}
              </div>

              {/* 3. Silhouette & Fit */}
              <div className="py-3">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'fit' ? null : 'fit')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#1c1c1a] cursor-pointer"
                >
                  <span>Silhouette & Fit</span>
                  <span>{expandedSection === 'fit' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'fit' && (
                  <div className="pt-3 text-[#1c1c1a]/80 leading-relaxed font-light">
                    <p>{product.fit || product.fitNote || 'Relaxed architectural fit.'}</p>
                    {product.modelStats && (
                      <p className="mt-2 text-[11px] text-stone-500 font-mono">
                        Model note: {product.modelStats}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Craft & Design Details */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'details' ? null : 'details')
                  }
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#1c1c1a] cursor-pointer"
                >
                  <span>Craft & Tailoring Details</span>
                  <span>{expandedSection === 'details' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'details' && (
                  <ul className="pt-3 space-y-1.5 text-[#1c1c1a]/80 list-disc list-inside font-light">
                    {designPointers.map((detail, index) => (
                      <li key={index} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 5. Care Instructions */}
              <div className="py-3">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#1c1c1a] cursor-pointer"
                >
                  <span>Care Guidelines</span>
                  <span>{expandedSection === 'care' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'care' && (
                  <div className="pt-3 text-[#1c1c1a]/80 leading-relaxed font-light">
                    <p>
                      {product.care ||
                        'Dry clean or gentle hand wash in cold water with mild detergent. Do not wring. Line dry in shade.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look / Companion Pieces */}
        {product.companionItems && product.companionItems.length > 0 && (
          <div className="border-t border-[#dcd8cf] pt-16 mb-24">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-1">
                Curated Ensemble
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#1c1c1a]">Complete The Look</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.companionItems.map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#e8e4dc]/40 rounded-xs overflow-hidden mb-2.5">
                    <Image
                      src={item.image || '/image1.jpg'}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h4 className="text-xs font-medium text-[#1c1c1a] group-hover:underline truncate">
                    {item.name}
                  </h4>
                  <span className="text-xs text-stone-500 font-mono mt-0.5 block">
                    ₹{item.price.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Garments */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="border-t border-[#dcd8cf] pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-1">
                More From {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#1c1c1a]">You May Also Consider</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((rel) => (
                <Link key={rel.id} href={`/product/${rel.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#e8e4dc]/40 rounded-xs overflow-hidden mb-2.5">
                    <Image
                      src={rel.image || '/image1.jpg'}
                      alt={rel.name}
                      fill
                      unoptimized={Boolean(rel.image?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-medium text-[#1c1c1a] group-hover:underline">
                      {rel.name}
                    </h4>
                    <span className="text-xs text-[#1c1c1a] font-mono ml-2">
                      ₹{rel.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#DBD8CF] max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#1c1c1a]/15">
            <div className="flex justify-between items-start border-b border-[#1c1c1a]/10 pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-bold">
                  Sizing Guide
                </span>
                <h3 className="text-lg font-serif uppercase tracking-wider text-[#1c1c1a] mt-0.5">
                  Body Measurements & Fit
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-stone-400 hover:text-stone-900 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#1c1c1a]/70 mb-4 leading-relaxed">
              All measurements are indicated in inches. Our garments are cut with relaxed ease to
              honor natural movement and fabric breathability.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#1c1c1a]/20 uppercase tracking-widest text-[10px] text-[#1c1c1a]/70">
                  <tr>
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Bust/Chest</th>
                    <th className="py-2.5">Waist</th>
                    <th className="py-2.5">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1a]/10 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 font-bold">XS</td>
                    <td className="py-2">32 - 34&quot;</td>
                    <td className="py-2">26 - 28&quot;</td>
                    <td className="py-2">34 - 36&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">S</td>
                    <td className="py-2">35 - 37&quot;</td>
                    <td className="py-2">29 - 31&quot;</td>
                    <td className="py-2">37 - 39&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">M</td>
                    <td className="py-2">38 - 40&quot;</td>
                    <td className="py-2">32 - 34&quot;</td>
                    <td className="py-2">40 - 42&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">L</td>
                    <td className="py-2">41 - 43&quot;</td>
                    <td className="py-2">35 - 37&quot;</td>
                    <td className="py-2">43 - 45&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">XL</td>
                    <td className="py-2">44 - 46&quot;</td>
                    <td className="py-2">38 - 40&quot;</td>
                    <td className="py-2">46 - 48&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1c1c1a]/10 text-[11px] text-stone-500">
              Need custom tailoring? Reach out to our atelier team via{' '}
              <a href="mailto:atelier@thekshaum.com" className="underline text-black">
                atelier@thekshaum.com
              </a>
              .
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
