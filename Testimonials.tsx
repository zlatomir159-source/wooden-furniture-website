import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Aura doesn't just make furniture; they define spaces. Every piece becomes the soul of the room it inhabits.",
    author: 'Elena Voss',
    role: 'Principal Designer, Voss Studio',
  },
  {
    quote: 'The texture of the wood is unlike anything I have seen in mass production. It speaks of patience, of hands that understood the material before touching it.',
    author: 'Marcus Chen',
    role: 'Interior Architect',
  },
  {
    quote: 'We specified Aura for three residential projects this year. The consistency of craftsmanship is remarkable, and the client response has been overwhelmingly positive.',
    author: 'Sofia Lindberg',
    role: 'Creative Director, Atelier Nordic',
  },
  {
    quote: 'Their dining table has become the heart of our home. Every dinner party begins with someone running their hand along the grain in quiet admiration.',
    author: 'James & Catherine Morley',
    role: 'Private Clients, London',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector('h2'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top center+=20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
    setCurrentIndex(clamped);
    const cardWidth = carousel.scrollWidth / testimonials.length;
    carousel.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' });
  };

  const handlePrev = () => scrollToCard(currentIndex - 1);
  const handleNext = () => scrollToCard(currentIndex + 1);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full bg-surface"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span
              className="font-sans text-xs font-medium uppercase tracking-widest block mb-4"
              style={{ color: '#666666', letterSpacing: '0.5px' }}
            >
              Testimonials
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(36px, 5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: '-0.72px',
                color: '#000000',
              }}
            >
              Words of Appreciation
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center border transition-all duration-300 hover:bg-terracotta hover:border-terracotta group"
              style={{ borderRadius: '100px', borderColor: '#000000' }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} className="transition-colors group-hover:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center border transition-all duration-300 hover:bg-terracotta hover:border-terracotta group"
              style={{ borderRadius: '100px', borderColor: '#000000' }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} className="transition-colors group-hover:text-white" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-start"
              style={{ width: 'clamp(300px, 45vw, 560px)' }}
            >
              <blockquote
                className="font-serif mb-8"
                style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: '-0.54px',
                  color: '#000000',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <p
                  className="font-sans text-sm font-medium"
                  style={{ color: '#000000' }}
                >
                  {t.author}
                </p>
                <p
                  className="font-sans text-xs"
                  style={{ color: '#666666' }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-3 mt-10">
          <button
            onClick={handlePrev}
            className="w-12 h-12 flex items-center justify-center border transition-all duration-300 hover:bg-terracotta hover:border-terracotta group"
            style={{ borderRadius: '100px', borderColor: '#000000' }}
            aria-label="Previous"
          >
            <ChevronLeft size={18} className="transition-colors group-hover:text-white" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 flex items-center justify-center border transition-all duration-300 hover:bg-terracotta hover:border-terracotta group"
            style={{ borderRadius: '100px', borderColor: '#000000' }}
            aria-label="Next"
          >
            <ChevronRight size={18} className="transition-colors group-hover:text-white" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className="transition-all duration-300"
              style={{
                width: currentIndex === i ? '32px' : '8px',
                height: '8px',
                borderRadius: '100px',
                background: currentIndex === i ? '#b95c3f' : '#cccccc',
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
