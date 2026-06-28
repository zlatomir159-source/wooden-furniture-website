import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import Navigation from '../sections/Navigation';
import HeroShader from '../sections/HeroShader';
import PhilosophySection from '../sections/PhilosophySection';
import SpotlightCollections from '../sections/SpotlightCollections';
import MaterialNarratives from '../sections/MaterialNarratives';
import SignaturePieces from '../sections/SignaturePieces';
import Testimonials from '../sections/Testimonials';
import Footer from '../sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as any);
    };
  }, []);

  return (
    <div className="relative">
      <Navigation />
      <HeroShader />
      <PhilosophySection />
      <SpotlightCollections />
      <MaterialNarratives />
      <SignaturePieces />
      <Testimonials />
      <Footer />
    </div>
  );
}
