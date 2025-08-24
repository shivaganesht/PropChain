"use client";

import { useEffect } from 'react';

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function useScrollReveal(options?: Options) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const els = Array.from(document.querySelectorAll('[data-sr]')) as Element[];
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    }, {
      root: options?.root ?? null,
      rootMargin: options?.rootMargin ?? '0px 0px -10% 0px',
      threshold: options?.threshold ?? 0.15,
    });

    els.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold]);
}
