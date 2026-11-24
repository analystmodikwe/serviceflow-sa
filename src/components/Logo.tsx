// Brand logo: the calendar icon plus the business name
type Props = { className?: string }

export default function Logo({ className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* aria-hidden: the visible text already names the brand */}
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0F766E" />
        <rect x="14" y="18" width="36" height="32" rx="6" fill="#ffffff" />
        <path d="M14 24a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v4H14z" fill="#CCFBF1" />
        <rect x="23" y="12" width="4" height="10" rx="2" fill="#ffffff" />
        <rect x="37" y="12" width="4" height="10" rx="2" fill="#ffffff" />
        <path
          d="M23 39l6 6 12-13"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-bold text-brand-600">ServiceFlow SA</span>
    </span>
  )
}