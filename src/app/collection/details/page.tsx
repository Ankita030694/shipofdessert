'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

export default function ProductDetails() {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState('/image1.jpg');
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);

  const thumbnails = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
  ];

  const handleAddToCart = async () => {
    setAdded(true);
    await addToCart({
      productId: 'kabira-top-in-cotton',
      slug: 'kabira-top-in-cotton',
      name: 'Kabira Top in Cotton',
      image: selectedImage || '/image1.jpg',
      price: 1750,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  // Sample related products
  const relatedProducts: Product[] = [
    {
      id: 1,
      slug: 'kaddy-top-in-cotton',
      name: 'Kaddy Top in Cotton',
      price: 1650,
      image: '/image1.jpg',
      colors: ['Black', 'Grey'],
    },
    {
      id: 3,
      slug: 'stella-slipper-in-leather',
      name: 'Stella Slipper in Leather',
      price: 920,
      image: '/image3.jpg',
      colors: ['Black', 'Brown'],
    },
    {
      id: 4,
      slug: 'alfidis-pant-in-cotton',
      name: 'Alfidis Pant in Cotton',
      price: 1390,
      image: '/image4.jpg',
      colors: ['Brown'],
    },
  ];

  return (
    <div className="bg-[#DBD8CF] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20 flex-1 max-w-6xl">
        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 mb-20">
          {/* Left side - Image gallery */}
          <div className="flex lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-visible">
            {thumbnails.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-[3/4] w-16 sm:w-20 bg-[#e8e4dc]/40 border transition-all cursor-pointer flex-shrink-0 ${
                  selectedImage === image
                    ? 'border-[#1c1c1a]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Product view ${index + 1}`}
                  fill
                  unoptimized={Boolean(image?.startsWith('data:'))}
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Center - Main image */}
          <div className="flex-1 relative aspect-[3/4] max-h-[750px] bg-[#e8e4dc]/30 rounded-sm overflow-hidden order-1 lg:order-2">
            <Image
              src={selectedImage}
              alt="Kabira Top in Cotton"
              fill
              priority
              unoptimized={Boolean(selectedImage?.startsWith('data:'))}
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right side - Product details */}
          <div className="w-full lg:w-96 flex flex-col justify-between order-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#bdb2a1] font-semibold block mb-1">
                The Inheritance 01
              </span>
              <h1 className="text-xl sm:text-2xl font-serif text-[#1c1c1a] font-normal tracking-wide mb-2">
                Kabira Top in Cotton
              </h1>
              <p className="text-base font-light text-[#1c1c1a] mb-6">₹1,750</p>

              {/* Color selection */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-[#1c1c1a] mb-2">
                  <span className="uppercase tracking-wider">Color</span>
                  <span className="text-[#1c1c1a]/70 font-light">{selectedColor}</span>
                </div>
                <div className="flex gap-2">
                  {['White', 'Off-White'].map((color) => (
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

              {/* Size selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 text-xs text-[#1c1c1a]">
                  <span className="uppercase tracking-wider">Select Size</span>
                  <button className="underline text-[#1c1c1a]/60 hover:text-[#1c1c1a] cursor-pointer">
                    Size Guide
                  </button>
                </div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-[#1c1c1a]/20 px-4 py-2.5 bg-[#DBD8CF] text-xs text-[#1c1c1a] focus:outline-none focus:border-[#1c1c1a] cursor-pointer"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#1c1c1a] text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#333330] transition-colors cursor-pointer mb-6"
              >
                {added ? 'Added to Bag ✓' : 'Add to Shopping Bag'}
              </button>

              {/* Product description */}
              <p className="text-xs sm:text-sm text-[#1c1c1a]/80 leading-relaxed mb-8">
                Relaxed crewneck top in softly brushed fine cotton with slightly oversized fit and ribbed neckline.
              </p>

              {/* Additional information */}
              <div className="border-t border-[#dcd8cf] divide-y divide-[#dcd8cf] text-xs">
                <div className="py-3.5">
                  <span className="font-semibold uppercase tracking-wider block mb-1">
                    Fabric & Craft
                  </span>
                  <p className="text-[#1c1c1a]/70">
                    100% Handcrafted Organic Cotton. Made by traditional Rajasthani weavers.
                  </p>
                </div>

                <div className="py-3.5">
                  <span className="font-semibold uppercase tracking-wider block mb-1">
                    Care Details
                  </span>
                  <p className="text-[#1c1c1a]/70">Dry clean or gentle hand wash in cold water.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-20 pt-8 border-t border-[#dcd8cf]">
          <h2 className="font-serif text-lg uppercase tracking-wider text-[#1c1c1a] mb-8">
            You May Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.slug}`} className="text-[#1c1c1a]">
                  <div className="relative aspect-[3/4] mb-3 bg-[#e8e4dc]/40 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized={Boolean(product.image?.startsWith('data:'))}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex justify-between items-start text-xs">
                    <h3 className="font-normal text-[#1c1c1a] group-hover:opacity-60 transition-opacity">
                      {product.name}
                    </h3>
                    <span className="text-[#1c1c1a]/80 ml-2">₹{product.price.toLocaleString()}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
