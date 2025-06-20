import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* First Column - Language and Country Selection */}
          <div>
            <div className="mb-4">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Choose language:</label>
              <select id="language" className="border border-gray-300 rounded-md px-3 py-1.5 w-full">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Select country:</label>
              <select id="country" className="border border-gray-300 rounded-md px-3 py-1.5 w-full">
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="ae">UAE</option>
                <option value="in">India</option>
              </select>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-black hover:opacity-75">About the Brand</Link></li>
              <li><Link href="/contact" className="text-black hover:opacity-75">Contact Us</Link></li>
              <li><Link href="/instagram" className="text-black hover:opacity-75">Instagram</Link></li>
            </ul>
          </div>

          {/* Third Column */}
          <div>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-black hover:opacity-75">Shipping</Link></li>
              <li><Link href="/return-policy" className="text-black hover:opacity-75">Return Policy</Link></li>
              <li><Link href="/start-return" className="text-black hover:opacity-75">Start a Return</Link></li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-black hover:opacity-75">FAQ</Link></li>
              <li><Link href="/legal-privacy" className="text-black hover:opacity-75">Legal & Privacy</Link></li>
              <li><Link href="/accessibility" className="text-black hover:opacity-75">Accessibility</Link></li>
            </ul>
          </div>

          {/* Fifth Column - Newsletter */}
          <div>
            <h3 className="font-medium mb-4 text-black">Subscribe to our Newsletter</h3>
            <form className="flex flex-col gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="border border-gray-300 rounded-md px-4 py-2"
                required
              />
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="privacy-consent" 
                  className="mt-1" 
                  required 
                />
                <label htmlFor="privacy-consent" className="text-sm text-gray-700">
                  I have read and understood the Privacy Policy
                </label>
              </div>
              <button 
                type="submit" 
                className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Logo and Copyright */}
        <div className="text-center mt-8">
          <Link href="/" className="font-serif text-xl text-black inline-flex items-center gap-2">
            <img src="/logoso.jpeg" alt="Ship of Desert Logo" className="h-8 w-auto" />
            SHIP OF DESERT
          </Link>
          <p className="text-sm text-black mt-2">© 2025 Ship Of Desert. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 