export default function ShoulderDropGlow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 875 907"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g opacity="0.3" filter="url(#shoulder_drop_blur)" style={{ mixBlendMode: "overlay" }}>
        <rect x="64" y="64" width="746.66" height="778.98" rx="373.33" fill="url(#shoulder_drop_grad)" />
      </g>
      <defs>
        <filter
          id="shoulder_drop_blur"
          x="0"
          y="0"
          width="874.66"
          height="906.98"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="32" result="effect1_foregroundBlur" />
        </filter>
        <linearGradient
          id="shoulder_drop_grad"
          x1="437.33"
          y1="64"
          x2="437.33"
          y2="842.98"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DAE2FD" stopOpacity="0.2" />
          <stop offset="1" stopColor="#DAE2FD" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
