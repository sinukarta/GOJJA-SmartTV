import React, { useEffect, useState } from 'react';

interface GojjaWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDescriptor?: boolean;
  variant?: 'color' | 'reverse' | 'monochrome';
  className?: string;
}

/**
 * Official GOJJA Open Future custom SVG wordmark (`gojja`)
 * Strictly follows Brand Guideline v1.0 & V-05 Open Future Design System:
 * - g: Cobalt #0050F5
 * - o: Indigo #4F3FE5 with signature top-right diagonal cut
 * - j (1st): Violet #7C35E0
 * - j (2nd): Magenta #CA3596
 * - a: Coral #FF5E70
 */
export const GojjaWordmark: React.FC<GojjaWordmarkProps> = ({
  size = 'md',
  showDescriptor = true,
  variant = 'color',
  className = '',
}) => {
  const dimensions = {
    sm: { width: 120, height: showDescriptor ? 44 : 34 },
    md: { width: 152, height: showDescriptor ? 56 : 42 },
    lg: { width: 210, height: showDescriptor ? 78 : 58 },
    xl: { width: 268, height: showDescriptor ? 100 : 74 },
  }[size];

  const c =
    variant === 'reverse'
      ? { g: '#FFFFFF', o: '#FFFFFF', j1: '#FFFFFF', j2: '#FFFFFF', a: '#FFFFFF', desc: '#F8F5EE' }
      : variant === 'monochrome'
      ? { g: '#10172F', o: '#10172F', j1: '#10172F', j2: '#10172F', a: '#10172F', desc: '#10172F' }
      : {
          g: '#0050F5',
          o: '#4F3FE5',
          j1: '#7C35E0',
          j2: '#CA3596',
          a: '#FF5E70',
          desc: 'currentColor',
        };

  return (
    <div className={`inline-flex items-center select-none shrink-0 ${className}`} aria-label="GOJJA SmartTV">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={showDescriptor ? '0 0 280 105' : '0 0 280 82'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <title>gojja SmartTV</title>
        {/* 'g' — Cobalt #0050F5 */}
        <path
          d="M36 16C20.536 16 8 28.536 8 44C8 59.464 20.536 72 36 72C43.5 72 49.8 68.9 53.5 64.2V69C53.5 78.5 46.8 84 36.2 84C28.4 84 22.5 80.6 19.2 76.2L10.5 82.8C15.8 90.2 24.8 94.5 36.5 94.5C54.2 94.5 65.5 83.6 65.5 67.5V17.5H53.5V24.2C49.5 19.1 43.2 16 36 16ZM36.8 61C27.2 61 19.8 53.6 19.8 44C19.8 34.4 27.2 27 36.8 27C46.4 27 53.8 34.4 53.8 44C53.8 53.6 46.4 61 36.8 61Z"
          fill={c.g}
        />

        {/* 'o' with Open Future diagonal cut — Indigo #4F3FE5 */}
        <path
          d="M106 16C90.536 16 78 28.536 78 44C78 59.464 90.536 72 106 72C121.464 72 134 59.464 134 44C134 39.2 132.8 34.7 130.6 30.7L120.8 36.5C121.7 38.8 122.2 41.3 122.2 44C122.2 53.6 115 61 106 61C97 61 89.8 53.6 89.8 44C89.8 34.4 97 27 106 27C109.6 27 112.9 28.1 115.6 30L123.5 21.2C118.6 17.9 112.5 16 106 16Z"
          fill={c.o}
        />

        {/* 1st 'j' — Violet #7C35E0 */}
        <circle cx="154" cy="7.5" r="6.8" fill={c.j1} />
        <path
          d="M148 17.5H160V69.5C160 83.5 151.4 93.2 137.5 94.5L135.5 83.5C143.8 82.5 148 77.6 148 69V17.5Z"
          fill={c.j1}
        />

        {/* 2nd 'j' — Magenta #CA3596 */}
        <circle cx="178" cy="7.5" r="6.8" fill={c.j2} />
        <path
          d="M172 17.5H184V69.5C184 83.5 175.4 93.2 161.5 94.5L159.5 83.5C167.8 82.5 172 77.6 172 69V17.5Z"
          fill={c.j2}
        />

        {/* 'a' — Coral #FF5E70 */}
        <path
          d="M224 16C208.536 16 196 28.536 196 44C196 59.464 208.536 72 224 72C231.5 72 238 68.8 242 63.8V70.5H254V17.5H242V24.2C238 19.2 231.5 16 224 16ZM225 61C215.4 61 208 53.6 208 44C208 34.4 215.4 27 225 27C234.6 27 242 34.4 242 44C242 53.6 234.6 61 225 61Z"
          fill={c.a}
        />

        {/* Stacked 'SmartTV' descriptor */}
        {showDescriptor && (
          <text
            x="196"
            y="99"
            fill={c.desc}
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="700"
            fontSize="16.5"
            letterSpacing="-0.02em"
          >
            SmartTV
          </text>
        )}
      </svg>
    </div>
  );
};

/**
 * Rolling KPI Number component (650ms smooth interpolation from previous value to new value,
 * while respecting prefers-reduced-motion and keeping tabular numerals aligned).
 */
export const RollingKpiValue: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  formatIdr?: boolean;
  animate?: boolean;
}> = ({ value, prefix = '', suffix = '', formatIdr = false, animate = true }) => {
  const [displayVal, setDisplayVal] = useState<number>(value);

  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayVal(value);
      return;
    }
    const startVal = displayVal;
    const diff = value - startVal;
    if (diff === 0) return;

    const duration = 650;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(startVal + diff * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayVal(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, animate]);

  const formatted = formatIdr ? `Rp${displayVal.toLocaleString('id-ID')}` : displayVal.toLocaleString('en-US');

  return (
    <span className="font-mono-tabular tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
