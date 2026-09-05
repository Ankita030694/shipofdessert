import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CollectionLoading() {
  return (
    <div className="bg-[#f5f5f5] text-[#1c1c1a] min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="pt-36 pb-28 flex-1 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1c1c1a]/20 border-t-[#1c1c1a] rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#1c1c1a]/60">
          Loading collection...
        </p>
      </main>
      <Footer />
    </div>
  );
}
