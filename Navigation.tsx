import { useEffect, useRef, useState } from 'react';
import { Search, Heart, ShoppingBag } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '#collections' },
    { label: 'Collections', href: '#pieces' },
    { label: 'Materials', href: '#materials' },
    { label: 'Spaces', href: '#testimonials' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        height: '80px',
        background: scrolled ? 'rgba(243,231,217,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-8">
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
          className="font-sans text-base font-bold tracking-widest transition-colors duration-300"
          style={{ color: scrolled ? '#000000' : '#ffffff' }}
        >
          AURA
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="font-sans text-xs font-medium uppercase tracking-wider relative group transition-colors duration-300"
              style={{ color: scrolled ? '#333333' : '#ffffff', letterSpacing: '0.5px' }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: scrolled ? '#000000' : '#ffffff' }}
              />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button
            className="transition-colors duration-300"
            style={{ color: scrolled ? '#333333' : '#ffffff' }}
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button
            className="transition-colors duration-300"
            style={{ color: scrolled ? '#333333' : '#ffffff' }}
            aria-label="Wishlist"
          >
            <Heart size={18} strokeWidth={1.5} />
          </button>
          <button
            className="relative transition-colors duration-300"
            style={{ color: scrolled ? '#333333' : '#ffffff' }}
            aria-label="Shopping bag"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span
              className="absolute -top-2 -right-3 font-sans text-[10px] font-medium flex items-center justify-center"
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '100px',
                background: scrolled ? '#b95c3f' : '#ffffff',
                color: scrolled ? '#ffffff' : '#000000',
              }}
            >
              2
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
