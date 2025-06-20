"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "The Art of Simplicity",
    subtitle: "Embracing minimalism in design",
    description: "Exploring how less can be more in modern design philosophy and its impact on user experience.",
    image: "/image1.jpg"
  },
  {
    id: 2,
    title: "Contrast in Motion",
    subtitle: "Black & white photography",
    description: "The timeless appeal of monochromatic imagery and why it continues to captivate audiences worldwide.",
    image: "/image2.jpg"
  },
  {
    id: 3,
    title: "Typography Matters",
    subtitle: "The silent communicator",
    description: "How the right font choices can dramatically alter perception and convey complex emotions without words.",
    image: "/image3.jpg"
  },
  {
    id: 4,
    title: "Negative Space",
    subtitle: "Finding beauty in absence",
    description: "Why what's not there is often as important as what is in creating balanced, effective designs.",
    image: "/image4.jpg"
  },
  {
    id: 5,
    title: "The Grid System",
    subtitle: "Foundation of modern layouts",
    description: "Understanding how structured approaches to positioning create harmony and improve readability.",
    image: "/image1.jpg"
  },
  {
    id: 6,
    title: "Interactive Elements",
    subtitle: "Engaging the user",
    description: "Creating meaningful connections through thoughtful interaction design and subtle motion cues.",
    image: "/image2.jpg"
  },
  {
    id: 7,
    title: "Accessibility First",
    subtitle: "Design for everyone",
    description: "Why inclusive design principles make experiences better not just for some users, but for all users.",
    image: "/image3.jpg"
  },
  {
    id: 8,
    title: "Emotional Design",
    subtitle: "Beyond aesthetics",
    description: "How to create interfaces that forge emotional connections and build brand loyalty over time.",
    image: "/image4.jpg"
  },
  {
    id: 9,
    title: "Shadow & Light",
    subtitle: "Creating visual hierarchy",
    description: "Using contrast and depth to guide attention and create focus in complex layouts.",
    image: "/image1.jpg"
  },
  // Add more posts as needed
];

const POSTS_PER_PAGE = 6;

export default function JournalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  
  // Get current posts
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Card staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  return (
    <div>
      <Navbar />
      
      {/* Banner Image */}
      <div className="relative w-full h-[50vh] md:h-[50vh] mt-25 mx-4">
        <Image
          src="/sodhero.jpg"
          alt="Journal Banner"
          fill
          priority
          className="object-cover"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white shadow-text">Journal</h1>
        </div> */}
      </div>

      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tight text-black mb-4">Journal</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Thoughts, ideas, and explorations in the realm of design and creativity.
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {currentPosts.map((post) => (
              <motion.article 
                key={post.id}
                variants={item}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className="flex flex-col overflow-hidden group cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight text-black mb-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h2>
                    <h3 className="text-lg text-gray-600 mb-3 italic">
                      {post.subtitle}
                    </h3>
                    <p className="text-gray-700 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <motion.span 
                      className="inline-block relative text-black font-medium"
                      whileHover={{ x: 5 }}
                    >
                      Read more
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                    </motion.span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center mt-16"
          >
            <nav className="inline-flex space-x-1" aria-label="Pagination">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-black hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-black text-white' 
                      : 'text-black hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-black hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                Next
              </button>
            </nav>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
