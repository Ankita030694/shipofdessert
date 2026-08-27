import { Metadata } from 'next';
import ProductDetails from '../../collection/details/page';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} — KSHAUM`,
    description: `Discover the ${formattedTitle} by KSHAUM. Crafted with considered silhouettes, enduring natural fibers and quiet elegance.`,
    alternates: {
      canonical: `https://thekshaum.com/product/${slug}`,
    },
    openGraph: {
      title: `${formattedTitle} — KSHAUM`,
      description: `Discover the ${formattedTitle} by KSHAUM. Crafted with considered silhouettes, enduring natural fibers and quiet elegance.`,
      url: `https://thekshaum.com/product/${slug}`,
    },
  };
}

export default function ProductPage() {
  return <ProductDetails />;
}
