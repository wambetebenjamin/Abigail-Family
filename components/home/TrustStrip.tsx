const items = [
  { value: 'One', label: 'shared space for both parents' },
  { value: 'Six', label: 'coordination tools in one place' },
  { value: 'KDPA', label: '2019 aligned child data protection' },
]

export default function TrustStrip() {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-page grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-3 px-2 py-5 sm:justify-center sm:px-6">
            <span className="font-display text-2xl text-primary sm:text-3xl">{item.value}</span>
            <span className="text-xs leading-snug text-muted sm:text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
