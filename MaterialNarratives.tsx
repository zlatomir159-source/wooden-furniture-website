import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MaterialNarratives() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    gsap.fromTo(
      text.children,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: '#2a2a2a',
        padding: '120px 0',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8">
        <div
          className="relative mx-auto overflow-hidden"
          style={{ width: '90%', maxWidth: '1200px' }}
        >
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="w-full h-auto block"
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
          >
            <source src="/videos/smoke-swirl.mp4" type="video/mp4" />
          </video>

          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            style={{ mixBlendMode: 'difference' }}
          >
            <h2
              className="font-serif text-white mb-6"
              style={{
                fontSize: 'clamp(36px, 5vw, 72px)',
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: '-1.08px',
              }}
            >
              Forged in Nature
            </h2>
            <p
              className="font-sans text-white max-w-xl"
              style={{
                fontSize: '18px',
                lineHeight: 1.5,
                opacity: 0.85,
              }}
            >
              Our materials are sourced from sustainable forests, ensuring that the beauty you bring home is rooted in respect for the earth.
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1000px] mx-auto">
          {[
            { label: 'Walnut', desc: 'Deep, rich tones with exceptional grain patterns. Sourced from responsibly managed North American forests.' },
            { label: 'White Oak', desc: 'Strong, durable, and naturally resistant to moisture. A timeless choice for heirloom-quality furniture.' },
            { label: 'Ash', desc: 'Light, flexible, and strikingly beautiful. Celebrated for its distinctive cathedral grain and workability.' },
          ].map((wood) => (
            <div key={wood.label} className="text-center">
              <h3
                className="font-serif mb-4"
                style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#ffffff',
                  letterSpacing: '-0.36px',
                }}
              >
                {wood.label}
              </h3>
              <p
                className="font-sans"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {wood.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
