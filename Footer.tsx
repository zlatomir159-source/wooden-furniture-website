import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    gsap.fromTo(
      content.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: content,
          start: 'top bottom-=20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const footerLinks = [
    {
      title: 'Shop',
      links: ['Dining', 'Living', 'Bedroom', 'Office', 'Outdoor'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Craftsmanship', 'Sustainability', 'Careers', 'Press'],
    },
    {
      title: 'Support',
      links: ['Contact', 'Shipping', 'Returns', 'Care Guide', 'Warranty'],
    },
    {
      title: 'Connect',
      links: ['Showrooms', 'Trade Program', 'Affiliates', 'Gift Cards'],
    },
  ];

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative w-full"
      style={{ background: '#b95c3f' }}
    >
      {/* Newsletter Section */}
      <div
        className="w-full"
        style={{ padding: '120px 0 80px' }}
      >
        <div ref={contentRef} className="max-w-[1400px] mx-auto px-8 text-center">
          <h2
            className="font-serif text-white mb-4"
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-1.08px',
            }}
          >
            Join the Inner Circle
          </h2>
          <p
            className="font-sans text-white mb-12 max-w-md mx-auto"
            style={{ fontSize: '16px', lineHeight: 1.5, opacity: 0.8 }}
          >
            Be the first to discover new collections, exclusive offers, and stories from the workshop.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full sm:flex-1 bg-transparent border-b border-white/40 text-white placeholder-white/50 font-sans text-sm py-3 px-1 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="font-sans text-xs font-medium uppercase tracking-widest px-8 py-3 bg-white transition-all duration-500 hover:bg-black hover:text-white"
                style={{
                  borderRadius: '100px',
                  color: '#b95c3f',
                  letterSpacing: '0.5px',
                }}
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="font-display italic text-white text-xl">
              Thank you for joining. Welcome to the inner circle.
            </p>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div
        className="w-full"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          padding: '60px 0 40px',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4
                  className="font-sans text-xs font-medium uppercase tracking-widest text-white mb-5"
                  style={{ letterSpacing: '0.5px' }}
                >
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-sm transition-opacity duration-300 hover:opacity-100"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Youtube, label: 'Youtube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="transition-opacity duration-300 hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  aria-label={label}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <p
              className="font-sans text-xs"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              &copy; 2025 Aura Interiors. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
