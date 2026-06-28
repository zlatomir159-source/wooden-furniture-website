import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextBlock {
  text: string;
}

const textBlocks: TextBlock[] = [
  { text: 'We believe in the soul of the material. Each piece of timber is selected not merely for its grain, but for the story it carries within its rings.' },
  { text: 'Every curve is carved by hand, guided by decades of accumulated wisdom and an unwavering commitment to the integrity of the form.' },
  { text: 'Our furniture does not simply occupy space. It transforms it. It anchors memory, shelters conversation, and witnesses the quiet rituals of daily life.' },
];

function AnimatedParagraph({ text, index }: { text: string; words: string[]; index: number }) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wordSpans = el.querySelectorAll<HTMLSpanElement>('.word');

    gsap.set(wordSpans, {
      opacity: 0.25,
      y: 20,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=10%',
        end: 'bottom center+=20%',
        scrub: 1,
      },
    });

    tl.to(wordSpans, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'none',
    });

    return () => {
      tl.kill();
    };
  }, [index]);

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      className="font-display italic mb-16 last:mb-0"
      style={{
        fontSize: 'clamp(24px, 3vw, 32px)',
        fontWeight: 500,
        lineHeight: 1.4,
        color: '#000000',
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="word inline-block mr-[0.3em]">
          {word}
        </span>
      ))}
    </p>
  );
}

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full bg-base"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[600px] mx-auto px-6">
        <div className="mb-16">
          <span
            className="font-sans text-xs font-medium uppercase tracking-widest"
            style={{ color: '#666666', letterSpacing: '0.5px' }}
          >
            Our Philosophy
          </span>
        </div>
        {textBlocks.map((block, i) => (
          <AnimatedParagraph
            key={i}
            text={block.text}
            words={block.text.split(' ')}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
