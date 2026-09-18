'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { useCart } from '@/context/CartContext';
import { getColorHex } from '@/lib/colors';
import { formatSizeLabel } from '@/lib/sizes';

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
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPieceOption, setSelectedPieceOption] = useState<'full' | 'top' | 'bottom' | 'additional'>('full');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    'description' | 'fabric' | 'fit' | 'details' | 'care' | null
  >('details');

  // Draggable Carousel State & Ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const productImages = (product?.images && product.images.length > 0)
    ? product.images
    : product?.image
    ? [product.image]
    : ['/image1.jpg'];

  const currentActiveImage = productImages[activeImageIndex] || productImages[0] || '/image1.jpg';

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.4;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    const width = carouselRef.current.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(carouselRef.current.scrollLeft / width);
      const boundedIndex = Math.max(0, Math.min(productImages.length - 1, newIndex));
      carouselRef.current.scrollTo({
        left: boundedIndex * width,
        behavior: 'smooth',
      });
      setActiveImageIndex(boundedIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleScroll = () => {
    if (!carouselRef.current || isDragging) return;
    const width = carouselRef.current.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(carouselRef.current.scrollLeft / width);
      if (newIndex !== activeImageIndex && newIndex >= 0 && newIndex < productImages.length) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  const scrollToImage = (index: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.clientWidth;
    carouselRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
    setActiveImageIndex(index);
  };

  const handlePrevImage = () => {
    scrollToImage(Math.max(0, activeImageIndex - 1));
  };

  const handleNextImage = () => {
    scrollToImage(Math.min(productImages.length - 1, activeImageIndex + 1));
  };

  const { addToCart } = useCart();

  useEffect(() => {
    setActiveImageIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [slug]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
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


  const handleAddToCart = async () => {
    if (!product) return;

    const chosenColor = selectedColor || product.colors?.[0] || 'Standard';
    const chosenSize = formatSizeLabel(selectedSize || product.sizes?.[0] || 'M');

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

    let itemImage = currentActiveImage;

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
    const chosenSize = formatSizeLabel(selectedSize || product.sizes?.[0] || 'M');

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

    let itemImage = currentActiveImage;

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
      <div className="bg-[#635F58] text-[#F4F4F1] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-xs uppercase tracking-widest text-[#F4F4F1]/60 animate-pulse">
            Loading garment details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#635F58] text-[#F4F4F1] min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <h1 className="text-xl font-serif uppercase tracking-wider mb-2">Product Not Found</h1>
          <p className="text-xs text-[#F4F4F1]/60 mb-6">
            The requested piece could not be located in our current collection.
          </p>
          <Link
            href="/collection"
            className="text-xs uppercase tracking-widest border-b border-[#F4F4F1] pb-0.5 hover:opacity-60"
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
    <div className="bg-[#635F58] text-[#F4F4F1] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 flex-1 max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-[11px] uppercase tracking-widest text-[#F4F4F1]/50 mb-8">
          <Link href="/collection" className="hover:text-[#F4F4F1]">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-[#F4F4F1]">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-24 items-start">
          {/* Left Column: Draggable Image Carousel (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[3/4] bg-[#524E48]/40 rounded-xs overflow-hidden border border-[#F4F4F1]/10 max-h-[780px] group select-none">
              {/* Draggable Carousel Track */}
              <div
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onScroll={handleScroll}
                className={`w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab ${
                  isDragging ? 'cursor-grabbing !scroll-auto' : 'scroll-smooth'
                }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0 snap-center relative aspect-[3/4] select-none"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} — view ${index + 1}`}
                      fill
                      draggable={false}
                      priority={index === 0}
                      unoptimized={Boolean(img?.startsWith('data:'))}
                      className="object-cover object-center pointer-events-none select-none"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows (visible on hover when multiple images) */}
              {productImages.length > 1 && (
                <>
                  {activeImageIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#635F58]/85 hover:bg-[#635F58] text-[#F4F4F1] border border-[#F4F4F1]/20 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20 backdrop-blur-xs"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {activeImageIndex < productImages.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#635F58]/85 hover:bg-[#635F58] text-[#F4F4F1] border border-[#F4F4F1]/20 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20 backdrop-blur-xs"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Indicator Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {productImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToImage(idx)}
                        aria-label={`Go to image ${idx + 1}`}
                        className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                          idx === activeImageIndex
                            ? 'w-6 bg-[#F4F4F1]'
                            : 'w-1.5 bg-[#F4F4F1]/30 hover:bg-[#F4F4F1]/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Image Counter Tag */}
                  <div className="absolute bottom-3 right-3 bg-[#F4F4F1]/70 backdrop-blur-xs text-white text-[10px] tracking-widest font-mono px-2 py-0.5 rounded-xs pointer-events-none z-20">
                    {activeImageIndex + 1} / {productImages.length}
                  </div>
                </>
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
              <h1 className="text-2xl sm:text-3xl font-serif text-[#F4F4F1] font-normal tracking-wide mb-3">
                {product.name}
              </h1>

              {/* Price + Inclusive of Taxes Note */}
              <div className="border-b border-[#F4F4F1]/20 pb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl sm:text-2xl font-serif font-light text-[#F4F4F1]">
                    ₹{activePrice.toLocaleString()}
                  </span>
                  {!product.inStock && (
                    <span className="text-[10px] uppercase tracking-wider text-[#635F58] bg-[#F4F4F1] px-2 py-0.5 ml-auto font-medium">
                      Made to Order
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#F4F4F1]/60 font-light mt-1">
                  Inclusive of all taxes. Complimentary express shipping across India.
                </p>
              </div>
            </div>

            {/* Short Fit Note & Model Stats */}
            {product.fitNote && (
              <div className="bg-[#635F58]/70 p-3 rounded-xs flex items-center gap-2.5 text-xs text-[#F4F4F1]/80">
                <span className="text-sm">📏</span>
                <div>
                  <span className="font-medium text-[#F4F4F1]">{product.fitNote}</span>
                  {product.modelStats && product.modelStats !== product.fitNote && (
                    <span className="text-[11px] text-[#F4F4F1]/60 block mt-0.5">
                      {product.modelStats}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Colour Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex justify-between text-xs text-[#F4F4F1] mb-2.5">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">
                    Colour : <strong className="text-[#F4F4F1] font-normal">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    const bg = getColorHex(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={`Select ${color}`}
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-[#F4F4F1] ring-2 ring-[#F4F4F1] ring-offset-2 ring-offset-[#635F58]'
                            : 'border-[#F4F4F1]/30 hover:border-[#F4F4F1]'
                        }`}
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector & Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2.5 text-xs text-[#F4F4F1]">
                  <span className="uppercase tracking-wider font-semibold text-[11px]">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="underline text-[#F4F4F1]/70 hover:text-[#F4F4F1] cursor-pointer flex items-center gap-1.5 text-[11px]"
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
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-xs uppercase tracking-wider border transition-all cursor-pointer font-mono ${
                        selectedSize === size
                          ? 'border-[#F4F4F1] bg-[#F4F4F1] text-[#635F58] font-bold'
                          : 'border-[#F4F4F1]/20 bg-[#635F58] text-[#F4F4F1] hover:border-[#F4F4F1]'
                      }`}
                    >
                      {formatSizeLabel(size)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart + Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#F4F4F1] text-[#635F58] py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#eaeae7] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {added ? 'Added to Bag ✓' : 'Add to Shopping Bag'}
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full border border-[#F4F4F1] text-[#F4F4F1] py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#F4F4F1] hover:text-[#635F58] transition-colors cursor-pointer text-center block"
              >
                Buy Now
              </button>
            </div>

            {/* Editorial Accordion Tabs */}
            <div className="border-t border-[#F4F4F1]/20 pt-4 divide-y divide-[#F4F4F1]/20 text-xs">
              {/* 1. Description */}
              <div className="py-3">
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'description' ? null : 'description')
                  }
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#F4F4F1] cursor-pointer"
                >
                  <span>Editorial Description</span>
                  <span>{expandedSection === 'description' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'description' && (
                  <div className="pt-3 text-[#F4F4F1]/80 leading-relaxed font-light">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              {/* 2. Fabric & Material */}
              <div className="py-3">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'fabric' ? null : 'fabric')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#F4F4F1] cursor-pointer"
                >
                  <span>Fabric & Drape</span>
                  <span>{expandedSection === 'fabric' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'fabric' && (
                  <div className="pt-3 text-[#F4F4F1]/80 leading-relaxed font-light">
                    <p>{product.fabric || '100% Handcrafted Natural Fiber.'}</p>
                  </div>
                )}
              </div>

              {/* 3. Silhouette & Fit */}
              <div className="py-3">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'fit' ? null : 'fit')}
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#F4F4F1] cursor-pointer"
                >
                  <span>Silhouette & Fit</span>
                  <span>{expandedSection === 'fit' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'fit' && (
                  <div className="pt-3 text-[#F4F4F1]/80 leading-relaxed font-light">
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
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#F4F4F1] cursor-pointer"
                >
                  <span>Craft & Tailoring Details</span>
                  <span>{expandedSection === 'details' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'details' && (
                  <ul className="pt-3 space-y-1.5 text-[#F4F4F1]/80 list-disc list-inside font-light">
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
                  className="w-full flex justify-between items-center text-left uppercase tracking-wider font-medium text-[#F4F4F1] cursor-pointer"
                >
                  <span>Care Guidelines</span>
                  <span>{expandedSection === 'care' ? '−' : '+'}</span>
                </button>
                {expandedSection === 'care' && (
                  <div className="pt-3 text-[#F4F4F1]/80 leading-relaxed font-light">
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
          <div className="border-t border-[#F4F4F1]/20 pt-16 mb-24">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-1">
                Curated Ensemble
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F4F4F1]">Complete The Look</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-x-3">
              {product.companionItems.map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#524E48]/40 rounded-xs overflow-hidden mb-2.5">
                    <Image
                      src={item.image || '/image1.jpg'}
                      alt={item.name}
                      fill
                      unoptimized={Boolean(item.image?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h4 className="text-xs font-medium text-[#F4F4F1] group-hover:underline truncate">
                    {item.name}
                  </h4>
                  <span className="text-xs text-[#F4F4F1]/70 font-mono mt-0.5 block">
                    ₹{item.price.toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Garments */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="border-t border-[#F4F4F1]/20 pt-16">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#bdb2a1] font-semibold block mb-1">
                More From {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F4F4F1]">You May Also Consider</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-x-3">
              {product.relatedProducts.map((rel) => (
                <Link key={rel.id} href={`/product/${rel.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#524E48]/40 rounded-xs overflow-hidden mb-2.5">
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
                    <h4 className="text-xs font-medium text-[#F4F4F1] group-hover:underline">
                      {rel.name}
                    </h4>
                    <span className="text-xs text-[#F4F4F1] font-mono ml-2">
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
          <div className="bg-[#635F58] max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#F4F4F1]/15">
            <div className="flex justify-between items-start border-b border-[#F4F4F1]/10 pb-4 mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-bold">
                  Sizing Guide
                </span>
                <h3 className="text-lg font-serif uppercase tracking-wider text-[#F4F4F1] mt-0.5">
                  Body Measurements & Fit
                </h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-[#F4F4F1]/60 hover:text-[#F4F4F1] text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#F4F4F1]/70 mb-4 leading-relaxed">
              All measurements are indicated in inches. Our garments are cut with relaxed ease to
              honor natural movement and fabric breathability.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#F4F4F1]/20 uppercase tracking-widest text-[10px] text-[#F4F4F1]/70">
                  <tr>
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Bust/Chest</th>
                    <th className="py-2.5">Waist</th>
                    <th className="py-2.5">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F4F1]/10 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 font-bold">0 (XS)</td>
                    <td className="py-2">32 - 34&quot;</td>
                    <td className="py-2">26 - 28&quot;</td>
                    <td className="py-2">34 - 36&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">2 (S)</td>
                    <td className="py-2">35 - 37&quot;</td>
                    <td className="py-2">29 - 31&quot;</td>
                    <td className="py-2">37 - 39&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">4 (M)</td>
                    <td className="py-2">38 - 40&quot;</td>
                    <td className="py-2">32 - 34&quot;</td>
                    <td className="py-2">40 - 42&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">6 (L)</td>
                    <td className="py-2">41 - 43&quot;</td>
                    <td className="py-2">35 - 37&quot;</td>
                    <td className="py-2">43 - 45&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold">8 (XL)</td>
                    <td className="py-2">44 - 46&quot;</td>
                    <td className="py-2">38 - 40&quot;</td>
                    <td className="py-2">46 - 48&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4F4F1]/10 text-[11px] text-[#F4F4F1]/70">
              Need custom tailoring? Reach out to our atelier team via{' '}
              <a href="mailto:atelier@thekshaum.com" className="underline text-[#F4F4F1]">
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
