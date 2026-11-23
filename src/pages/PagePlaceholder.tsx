interface PagePlaceholderProps {
  title: string
}

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-brand-700">{title}</h1>
      <p className="mt-2">Coming soon.</p>
    </section>
  )
}
