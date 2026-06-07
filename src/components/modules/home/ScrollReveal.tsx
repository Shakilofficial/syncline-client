'use client';

import { useEffect } from 'react';

export const ScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            // Remove if you want scroll trigger to repeat when scrolling up/down
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-cascade');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null;
};

export default ScrollReveal;
