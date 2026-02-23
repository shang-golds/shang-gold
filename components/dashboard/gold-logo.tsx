"use client";

export function GoldLogo({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Shang Gold logo"
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="30%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#b8960e" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
        <linearGradient id="gold-shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#gold-gradient)" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="26" stroke="url(#gold-gradient)" strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Gold bar icon */}
      <path
        d="M20 38L24 24H40L44 38H20Z"
        fill="url(#gold-gradient)"
        opacity="0.9"
      />
      <path
        d="M22 38L25 28H39L42 38H22Z"
        fill="url(#gold-shine)"
        opacity="0.3"
      />
      {/* Shine line */}
      <line x1="28" y1="30" x2="36" y2="30" stroke="#f5e6b8" strokeWidth="0.5" opacity="0.6" />
      {/* S letter */}
      <text
        x="32"
        y="47"
        textAnchor="middle"
        fill="url(#gold-gradient)"
        fontSize="8"
        fontWeight="700"
        fontFamily="serif"
      >
        SG
      </text>
    </svg>
  );
}
