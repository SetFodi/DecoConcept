import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProductShowcase from '@/components/ProductShowcase';
import DocumentSection from '@/components/DocumentSection';
import InspirationGallery from '@/components/InspirationGallery';
import { getRoyalPaintProductsConfig } from '@/lib/royalPaintProductsStore';

export default async function HomePage() {
  const { products: royalPaintProducts } = await getRoyalPaintProductsConfig();

  return (
    <>
      <Hero />
      <AboutSection />
      <ProductShowcase royalPaintProducts={royalPaintProducts} />
      <InspirationGallery />
      <DocumentSection />
    </>
  );
}
