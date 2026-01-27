import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Features } from "@/components/sections/features";
import { Awards } from "@/components/sections/awards";
import { Impact } from "@/components/sections/impact";
import { Partners } from "@/components/sections/partners";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Awards />
      <Impact />
      <Partners />
      <Contact />
      <Footer />
    </main>
  );
}
