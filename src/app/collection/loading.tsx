import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CollectionLoading() {
  return (
    <div className="bg-[#1F1D1A] text-[#F4F4F1] min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="pt-36 pb-28 flex-1 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F4F4F1]/20 border-t-[#F4F4F1] rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4F4F1]/60">
          Loading collection...
        </p>
      </main>
      <Footer />
    </div>
  );
}
