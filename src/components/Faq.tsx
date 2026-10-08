export interface FaqItem { q: string; a: React.ReactNode }

/** Native details/summary: keyboard accessible with no JS. */
export function Faq({ items, title = "FAQ" }: { items: FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="font-heading text-2xl font-black uppercase">{title}</h2>
      <div className="mt-4 divide-y-2 divide-fg border-y-2 border-fg">
        {items.map((it) => (
          <details key={it.q} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-lg font-bold">
              {it.q}
              <span aria-hidden="true" className="ml-4 text-2xl leading-none group-open:rotate-45">+</span>
            </summary>
            <div className="pb-2 pt-2 text-base">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
