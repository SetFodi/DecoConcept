import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProductShowcase from '@/components/ProductShowcase';
import DocumentSection from '@/components/DocumentSection';
import InspirationGallery from '@/components/InspirationGallery';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ProductShowcase />
      <InspirationGallery />
      <DocumentSection />
    </>
  );
}
