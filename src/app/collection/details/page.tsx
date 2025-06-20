'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState('/image1.jpg')
  
  const thumbnails = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
  ]

  // Sample related products
  const relatedProducts: Product[] = [
    {
      id: 1,
      name: "Kaddy Top in Cotton",
      price: 1650,
      image: "/image1.jpg",
      colors: ["Black", "Grey"]
    },
    {
      id: 3,
      name: "Stella Slipper in Leather",
      price: 920,
      image: "/image3.jpg",
      colors: ["Black", "Brown"]
    },
    {
      id: 4,
      name: "Alfidis Pant in Cotton",
      price: 1390,
      image: "/image4.jpg",
      colors: ["Brown"]
    }
  ];

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-38">
        {/* Main product section */}
        <div className="flex gap-12 mb-20">
          {/* Left side - Image gallery */}
          <div className="w-24 flex flex-col gap-4 mt-30">
            {thumbnails.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className="relative aspect-square w-full border border-gray-200 hover:border-black"
              >
                <Image
                  src={image}
                  alt={`Product view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Center - Main image */}
          <div className="flex-1 relative">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={selectedImage}
                alt="Product main view"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="w-80">
            <h1 className="text-xl text-black mb-2">Kabira Top in Cotton</h1>
            <p className="text-black mb-8">$1,750</p>

            {/* Color selection */}
            <div className="mb-6">
              <p className="text-sm text-black mb-2">Color : White</p>
              <div className="flex gap-2">
                <button className="w-5 h-5 bg-gray-200 border border-gray-300" />
                <button className="w-5 h-5 bg-white border border-gray-300" />
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-black">Select Size</p>
                <button className="text-sm text-black underline">Size Guide</button>
              </div>
              <select className="w-full border border-black px-4 py-2 bg-white text-sm text-black">
                <option>Select Size</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>

            {/* Add to cart button */}
            <button className="w-full bg-black text-white py-3 mb-8">
              Add to Shopping Bag
            </button>

            {/* Product description */}
            <p className="text-sm text-black mb-6">
              Relaxed crewneck top in softly brushed fine cotton with slightly oversized fit and ribbed neckline.
            </p>

            {/* Additional information */}
            <div className="border-t border-gray-200 py-4">
              <button className="flex justify-between items-center w-full text-sm text-black">
                <span>More information</span>
                <span>+</span>
              </button>
            </div>

            {/* Care details */}
            <div className="border-t border-gray-200 py-4">
              <button className="flex justify-between items-center w-full text-sm text-black">
                <span>Care details</span>
                <span>+</span>
              </button>
            </div>

            {/* Share */}
            <div className="border-t border-gray-200 py-4">
              <button className="text-sm text-black">Share</button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-20">
          <h2 className="text-xl text-black mb-8">You May Also Like</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id} className="mb-8">
                <Link href={`/product/${product.id}`} className="text-black">
                  <div className="relative aspect-[3/4] mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-normal text-black">{product.name}</h3>
                    <span className="text-sm text-black">${product.price}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
