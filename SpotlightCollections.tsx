import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    title: 'The Dining Room',
    subtitle: 'Gathering Spaces',
    image: '/images/dining-room.jpg',
  },
  {
    title: 'The Living Room',
    subtitle: 'Quiet Comfort',
    image: '/images/living-room.jpg',
  },
  {
    title: 'The Study',
    subtitle: 'Thoughtful Design',
    image: '/images/study.jpg',
  },
  {
    title: 'The Bedroom',
    subtitle: 'Restful Sanctuary',
    image: '/images/bedroom.jpg',
  },
];

export default function SpotlightCollections() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=10%',
            end: 'top center',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative w-full bg-surface"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 mb-16">
        <span
          className="font-sans text-xs font-medium uppercase tracking-widest block mb-4"
          style={{ color: '#666666', letterSpacing: '0.5px' }}
        >
          Spotlight Collections
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
          Curated Spaces
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {collections.map((col, i) => (
            <div
              key={col.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="relative group cursor-pointer overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span
                  className="font-sans text-[10px] font-medium uppercase tracking-widest block mb-2 transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}
                >
                  {col.subtitle}
                </span>
                <h3
                  className="font-serif text-white transition-transform duration-500 group-hover:-translate-y-1"
                  style={{
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.36px',
                  }}
                >
                  {col.title}
                </h3>
              </div>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(185,92,63,0.15) 0%, transparent 60%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
