/** Logo „mlsná Beruška“ převzaté z materiálů cukrárny + textový název. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src={`${import.meta.env.BASE_URL}img/logo-beruska.png`}
        alt=""
        width={375}
        height={175}
        className={compact ? 'h-9 w-auto' : 'h-11 w-auto'}
      />
      <span className="hidden flex-col border-l border-cocoa-800/15 pl-3 text-[0.62rem] leading-tight font-bold tracking-[0.24em] text-cocoa-600 uppercase sm:flex">
        <span>Cukrárna</span>
        <span>Paskov</span>
      </span>
    </span>
  );
}
