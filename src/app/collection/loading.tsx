import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CollectionLoading() {
  return (
    <div className="bg-[#F4F4F1] text-[#635F58] min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="pt-36 pb-28 flex-1 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#635F58]/20 border-t-[#635F58] rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#635F58]/60">
          Loading collection...
        </p>
      </main>
      <Footer />
    </div>
  );
}
