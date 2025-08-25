interface MopedIconProps {
  className?: string;
  size?: number;
}

export const MopedIcon = ({ className, size = 32 }: MopedIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
  >
    <circle cx="50" cy="50" r="50" fill="#22c55e" />
    <g fill="white">
      {/* Moped body */}
      <path d="M25 45c-3 0-5 2-5 5v10c0 3 2 5 5 5h8l2-5h20l2 5h8c3 0 5-2 5-5V50c0-3-2-5-5-5H25z" />
      {/* Seat */}
      <path d="M35 35c-2 0-4 2-4 4v6c0 2 2 4 4 4h20c2 0 4-2 4-4v-6c0-2-2-4-4-4H35z" />
      {/* Handlebars */}
      <path d="M45 25c-1 0-2 1-2 2v8c0 1 1 2 2 2h10c1 0 2-1 2-2v-8c0-1-1-2-2-2H45z" />
      <circle cx="47" cy="27" r="2" />
      <circle cx="53" cy="27" r="2" />
      {/* Wheels */}
      <circle cx="30" cy="70" r="8" fill="white" stroke="#22c55e" strokeWidth="2" />
      <circle cx="70" cy="70" r="8" fill="white" stroke="#22c55e" strokeWidth="2" />
      <circle cx="30" cy="70" r="4" fill="#22c55e" />
      <circle cx="70" cy="70" r="4" fill="#22c55e" />
    </g>
  </svg>
);