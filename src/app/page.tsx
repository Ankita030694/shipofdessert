import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-screen mx-4">
        <Image
          src="/sodhero.jpg"
          alt="Sodher Background"
          fill
          priority
          className="object-cover"
        />
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* <h1 
            className="text-[#4A332D] font-normal w-full text-center font-['Playfair_Display']" 
            style={{ 
              fontSize: '100px', 
              lineHeight: '100%', 
              letterSpacing: '0%', 
              marginTop: '-400px'
            }}
          >
            KSHAUM
          </h1> */}
        </div>
      </div>

      {/* Image Grid Section */}
      {/* <div className="w-full py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/image1.jpg"
              alt="Fashion Image 1"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-6 left-6 flex flex-col text-white">
              <span className="text-lg font-light mb-1">Women's Re-Nylon for Elegant Look</span>
              <span className="text-xl font-medium mb-2">KSHAUM's Circular Revolution</span>
              <span className="text-sm font-bold tracking-wider mt-2">DISCOVER</span>
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/image2.jpg"
              alt="Fashion Image 2"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-6 left-6 flex flex-col text-white">
              <span className="text-lg font-light mb-1">Contemporary Spirit</span>
              <span className="text-xl font-medium mb-2">New Revolution in Men's Styling</span>
              <span className="text-sm font-bold tracking-wider mt-2">DISCOVER</span>
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/image4.jpg"
              alt="Fashion Image 3"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-6 left-6 flex flex-col text-white">
              <span className="text-lg font-light mb-1">Crafted for Function</span>
              <span className="text-xl font-medium mb-2">Women's Collection</span>
              <span className="text-sm font-bold tracking-wider mt-2">DISCOVER</span>
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/image3.jpg"
              alt="Fashion Image 4"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-6 left-6 flex flex-col text-white">
              <span className="text-lg font-light mb-1">Women's Elegance</span>
              <span className="text-xl font-medium mb-2">New Revolution in Women's Styling</span>
              <span className="text-sm font-bold tracking-wider mt-2">DISCOVER</span>
            </div>
          </div>
        </div>
      </div> */}
      <Footer />
    </>
  );
}
