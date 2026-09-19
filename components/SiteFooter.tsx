export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm text-muted sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg text-ink">Meridian Goods</p>
          <p className="mt-3 max-w-xs leading-relaxed">
            Useful things, made well. Designed in Portland, Maine and made in small batches by
            workshops we know by name.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink">Orders</p>
          <p className="mt-3 leading-relaxed">
            Orders leave our studio within two working days. Unused pieces can be returned within
            30 days.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink">Contact</p>
          <p className="mt-3 leading-relaxed">
            hello@meridiangoods.co
            <br />
            Monday to Friday, 9am to 5pm ET
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-muted">© 2026 Meridian Goods</div>
    </footer>
  );
}
