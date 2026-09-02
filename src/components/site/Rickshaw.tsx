/**
 * ZAKAAS auto-rickshaw — hand-drawn, ink-outlined, carrying snack packets.
 * Used as the horizontal "driving" element across marquee bands.
 */
export function RickshawArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={className}
      role="img"
      aria-label="ZAKAAS auto-rickshaw loaded with snack packets"
      fill="none"
    >
      <g stroke="var(--color-ink)" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round">
        {/* canopy */}
        <path
          d="M56 44c6-16 22-24 46-24s40 8 46 24l4 8H52l4-8Z"
          fill="var(--color-paper)"
        />
        {/* rear body */}
        <path
          d="M96 52h72v34c0 6-4 10-10 10h-62V52Z"
          fill="var(--color-bottle)"
        />
        {/* cabin */}
        <path
          d="M96 52H60c-8 0-14 6-16 14l-6 20c-1 5 2 10 8 10h50V52Z"
          fill="var(--color-red)"
        />
        {/* windscreen */}
        <path d="M62 58h28v20H50l5-15c1-3 4-5 7-5Z" fill="var(--color-paper)" opacity="0.85" />
        {/* rear side panel — brand board */}
        <rect x="126" y="58" width="34" height="24" rx="2" fill="var(--color-paper)" />
        {/* front bumper + headlight */}
        <path d="M38 88h-8c-4 0-6 3-6 6s3 6 7 6h9" fill="var(--color-ink)" />
        <circle cx="34" cy="80" r="5" fill="var(--color-gold)" />
        {/* wheels */}
        <circle cx="46" cy="102" r="13" fill="var(--color-ink)" />
        <circle cx="150" cy="102" r="13" fill="var(--color-ink)" />
        <circle cx="46" cy="102" r="4.5" fill="var(--color-paper)" />
        <circle cx="150" cy="102" r="4.5" fill="var(--color-paper)" />
        {/* snack packets in the back */}
        <rect x="100" y="30" width="18" height="16" rx="2" fill="var(--color-gold)" />
        <rect x="122" y="26" width="16" height="20" rx="2" fill="var(--color-red)" />
        <rect x="142" y="32" width="16" height="14" rx="2" fill="var(--color-paper)" />
        {/* tassels */}
        <path d="M100 44v6M110 44v6M120 44v6M130 44v6M140 44v6" strokeWidth="2.4" />
      </g>
      <text
        x="143"
        y="70"
        textAnchor="middle"
        fontSize="12"
        fontFamily="var(--font-display)"
        fill="var(--color-red)"
      >
        ZAKAAS
      </text>
      <text
        x="143"
        y="79"
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-marathi)"
        fill="var(--color-ink)"
      >
        झकासच
      </text>
    </svg>
  );
}

/** A rickshaw that drives left → right across the full width, on a loop. */
export function DrivingRickshaw({
  className,
  size = "h-16",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className ?? ""}`}
    >
      <div className="animate-rickshaw w-max will-change-transform">
        <div className="animate-bump">
          <RickshawArt className={`${size} w-auto`} />
        </div>
      </div>
    </div>
  );
}
