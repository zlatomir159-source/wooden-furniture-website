import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  name: string;
  category: string;
  price: string;
  image: string;
  quote: string;
  dimensions: string;
  material: string;
  finish: string;
}

const products: Product[] = [
  {
    name: 'Arcus Dining Table',
    category: 'Dining',
    price: '$4,800',
    image: '/images/product-table.jpg',
    quote: 'Where architecture meets the everyday ritual of gathering.',
    dimensions: '220 x 100 x 75 cm',
    material: 'Solid American Walnut',
    finish: 'Hand-rubbed Oil',
  },
  {
    name: 'Klein Armchair',
    category: 'Seating',
    price: '$2,400',
    image: '/images/product-chair.jpg',
    quote: 'Sculpted comfort that ages as gracefully as the hands that made it.',
    dimensions: '72 x 78 x 82 cm',
    material: 'Walnut Frame, Full-Grain Leather',
    finish: 'Natural Tan',
  },
  {
    name: 'Boucle Sofa',
    category: 'Living',
    price: '$6,200',
    image: '/images/product-sofa.jpg',
    quote: 'A generous embrace of soft oak and woven texture.',
    dimensions: '240 x 95 x 78 cm',
    material: 'White Oak, Boucle Wool',
    finish: 'Warm Linen',
  },
];

function FlipCard({ product }: { product: Product }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (centerY - e.clientY) / 20;
    const rotateY = (e.clientX - centerX) / 20;

    if (innerRef.current) {
      const baseRotate = isHovered ? 180 : 0;
      innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY + baseRotate}deg)`;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (innerRef.current) {
      innerRef.current.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (innerRef.current) {
      innerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center mb-32 last:mb-0">
      <div
        className="lg:col-span-3 relative w-full perspective-1200"
        style={{ height: 'clamp(350px, 40vw, 500px)' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={innerRef}
          className="relative w-full h-full transform-style-3d"
          style={{ transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded-lg overflow-hidden"
            style={{ background: '#1a1a1a' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            >
              <source src="/videos/turntable-table.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-sans text-xs font-medium uppercase tracking-widest text-white"
                style={{ letterSpacing: '0.5px', opacity: 0.8 }}
              >
                Explore the angles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col justify-center">
        <span
          className="font-sans text-[10px] font-medium uppercase tracking-widest mb-4"
          style={{ color: '#666666', letterSpacing: '0.5px' }}
        >
          {product.category}
        </span>
        <h3
          className="font-serif mb-3"
          style={{
            fontSize: 'clamp(28px, 3vw, 36px)',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '-0.54px',
            color: '#000000',
          }}
        >
          {product.name}
        </h3>
        <p
          className="font-display italic mb-6"
          style={{
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#333333',
          }}
        >
          &ldquo;{product.quote}&rdquo;
        </p>

        <div className="space-y-3 mb-8">
          {[
            { label: 'Dimensions', value: product.dimensions },
            { label: 'Material', value: product.material },
            { label: 'Finish', value: product.finish },
          ].map((spec) => (
            <div key={spec.label} className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-sans text-xs uppercase tracking-wider" style={{ color: '#666666' }}>
                {spec.label}
              </span>
              <span className="font-sans text-sm" style={{ color: '#333333' }}>
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span
            className="font-serif"
            style={{ fontSize: '24px', color: '#000000' }}
          >
            {product.price}
          </span>
          <button
            className="font-sans text-xs font-medium uppercase tracking-widest px-8 py-3 border transition-all duration-500 hover:bg-terracotta hover:border-terracotta hover:text-white"
            style={{
              borderRadius: '100px',
              borderColor: '#000000',
              color: '#000000',
              letterSpacing: '0.5px',
            }}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignaturePieces() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.grid > .perspective-1200');
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=10%',
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
      id="pieces"
      ref={sectionRef}
      className="relative w-full bg-base"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="mb-20">
          <span
            className="font-sans text-xs font-medium uppercase tracking-widest block mb-4"
            style={{ color: '#666666', letterSpacing: '0.5px' }}
          >
            Signature Pieces
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
            The Collection
          </h2>
        </div>

        {products.map((product) => (
          <FlipCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}
