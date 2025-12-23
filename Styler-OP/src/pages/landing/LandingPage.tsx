import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import Showcase from "./sections/Showcase";
import CTA from "./sections/CTA";

function LandingPage() {
  return (
    <>
      <title>
        StyleForge AI - Transform Photos Instantly | No Prompts Needed
      </title>
      <meta
        name="description"
        content="Transform your photos into stunning Ghibli, Anime, Pixar, and Comic art styles with AI. No prompts required - just upload and choose your style."
      />
      <meta
        property="og:title"
        content="StyleForge AI - Transform Photos Instantly"
      />
      <meta
        property="og:description"
        content="Upload your picture, choose a style, and let our AI do the magic. Ghibli, Anime, Pixar, Comic styles and more."
      />
      <div className="min-h-screen relative bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Showcase />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
