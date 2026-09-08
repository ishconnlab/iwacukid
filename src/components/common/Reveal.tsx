import { useEffect, useRef, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'span';
  delay?: 0 | 1 | 2 | 3 | 4;
  className?: string;
}

export function Reveal({ children, as = 'div', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      className={`reveal ${delay > 0 ? `reveal-delay-${delay}` : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}