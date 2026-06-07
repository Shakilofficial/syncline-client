'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export const FloatingControls = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/8801620521215"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:bg-[#20ba56] hover:scale-110 active:scale-95 transition-all group duration-300"
      >
        {/* Animated Ripple Waves */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none" />
        <span className="absolute -inset-1 rounded-full border border-[#25D366]/20 animate-pulse pointer-events-none" />

        <svg className="h-5.5 w-5.5 fill-white relative z-10" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.483 1.51 5.352 1.513 5.544 0 10.061-4.512 10.063-10.058.001-2.687-1.043-5.213-2.943-7.115-1.9-1.902-4.427-2.951-7.114-2.952-5.556 0-10.074 4.52-10.077 10.063-.001 1.831.48 3.623 1.396 5.212l-.993 3.625 3.71-.973zm8.382-3.188c-.3-.15-1.77-.875-2.03-.972-.26-.096-.45-.144-.64.145-.19.287-.72.911-.88 1.092-.16.182-.33.203-.63.053-.3-.15-1.27-.47-2.42-1.493-.896-.8-1.5-1.787-1.68-2.087-.18-.3-.02-.46.13-.61.14-.134.3-.35.45-.524.15-.173.2-.3.3-.5.1-.2.05-.375-.025-.526-.075-.15-.64-1.543-.88-2.11-.233-.564-.47-.487-.64-.496-.17-.008-.36-.01-.55-.01-.19 0-.5.07-.76.357-.26.287-1 .977-1 2.38 0 1.402 1.02 2.753 1.16 2.943.14.19 2.01 3.071 4.87 4.31.68.297 1.21.474 1.62.605.69.219 1.32.188 1.81.114.55-.082 1.77-.72 2.02-1.388.25-.668.25-1.24.18-1.388-.07-.15-.26-.24-.56-.39z" />
        </svg>
      </a>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-6 z-40 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default FloatingControls;
