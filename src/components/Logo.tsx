interface LogoProps {
  variant?: 'default' | 'white'
  className?: string
  showText?: boolean
}

export default function Logo({
  variant = 'default',
  className = '',
  showText = true,
}: LogoProps) {
  const icon = variant === 'white'
    ? '/brand/brand-icon-white.svg'
    : '/brand/brand-icon.svg'

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
      />
      {showText && (
        <span
          className={`font-display text-lg font-bold max-[359px]:hidden ${
            variant === 'white' ? 'text-surface' : 'text-brand-600'
          }`}
        >
          ServiceFlow<span className="text-accent-500"> SA</span>
        </span>
      )}
    </span>
  )
}