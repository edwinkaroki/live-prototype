export default function AppLogo({ size = 42, light = false }) {
  const labelColor = light ? 'text-white' : 'text-forestGreen'
  const sublabelColor = 'text-gold'

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label="Ujima Loan Pride logo"
        className="flex-shrink-0"
      >
        <rect width="48" height="48" rx="10" fill={light ? '#F8F3E7' : '#14532D'} />
        <path
          d="M14 15v12c0 6.1 4.1 10 10 10s10-3.9 10-10V15"
          fill="none"
          stroke={light ? '#14532D' : '#F8F3E7'}
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M15 31c4.6-1.5 7.8-3.9 10-7.1 2.3 1.7 5.1 2.5 8.4 2.5"
          fill="none"
          stroke="#D4AF37"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
        />
        <circle cx="14" cy="13" r="3" fill="#D4AF37" />
        <circle cx="24" cy="10" r="3" fill="#D4AF37" />
        <circle cx="34" cy="13" r="3" fill="#D4AF37" />
      </svg>
      <div className="leading-none">
        <h1 className={`${labelColor} text-xl font-bold tracking-wide`}>UJIMA</h1>
        <p className={`${sublabelColor} text-xs font-semibold tracking-wide`}>LOAN PRIDE</p>
      </div>
    </div>
  )
}
