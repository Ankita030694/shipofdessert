'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

export default function CollectionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Sample product data - replace with your actual data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Kaddy Top in Cotton",
      price: 1650,
      image: "/image1.jpg",
      colors: ["Black", "Grey"]
    },
    {
      id: 2,
      name: "Kabira Top in Cotton",
      price: 1750,
      image: "/image2.jpg",
      colors: ["White", "Grey"]
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
    },
    // Add more products to test pagination
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 5,
      name: `Product ${i + 5}`,
      price: 1000 + i * 100,
      image: `/image${(i % 4) + 1}.jpg`,
      colors: ["Black", "White"]
    }))
  ];

  // Calculate pagination values
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Filters and View Options */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            {/* Left side - Category and Items count */}
            <div className="flex items-center gap-4 text-black">
              <h1 className="text-lg font-normal">Women</h1>
              <span className="text-sm">•</span>
              <span className="text-sm">New Arrivals</span>
              <span className="text-sm text-gray-500">(24 items)</span>
            </div>

            {/* Right side - View options and Filter */}
            <div className="flex items-center gap-6">
              {/* View options */}
              <div className="flex items-center gap-4 text-black">
                <span className="text-sm">View:</span>
                <button className="underline text-sm">One</button>
                <button className="text-sm">Two</button>
              </div>

              {/* Filter button */}
              <button className="flex items-center gap-2 text-black">
                <span className="text-sm">Filter By</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 0 1 1-1h8a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1zm2 5a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zm2 5a1 1 0 0 1 1-1h0a1 1 0 1 1 0 2h0a1 1 0 0 1-1-1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex gap-2 py-4">
            <button className="px-3 py-1 text-sm border border-black text-black flex items-center gap-1">
              Size: M
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-3 py-1 text-sm border border-black text-black flex items-center gap-1">
              Color: Black
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="px-3 py-1 text-sm text-black underline">
              Clear all
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="mb-8">
                <Link href={`/collection/details`}>
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
          
          {/* Updated Pagination */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="flex gap-2">
              {currentPage > 1 && (
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 border border-gray-200 text-black hover:border-black"
                >
                  Previous
                </button>
              )}
              
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-4 py-2 border ${
                    currentPage === number 
                      ? 'border-black text-black'
                      : 'border-gray-200 text-black hover:border-black'
                  }`}
                >
                  {number}
                </button>
              ))}

              {currentPage < totalPages && (
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 border border-gray-200 text-black hover:border-black"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
