import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyNatural from "@/components/WhyNatural";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[--color-cream] overflow-x-hidden">
      {/* Navbar is rendered globally via layout.tsx → NavbarWrapper */}
      <Hero />
      <FeaturedProducts />
      <WhyNatural />
      <Testimonials />
      <Footer />
    </main>
  );
}
