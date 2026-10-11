import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { business } from '../../data/business';
import { useOrder } from '../../order/store';
import { BagIcon, CloseIcon, MenuIcon, PhoneIcon } from '../ui/Icons';
import { Logo } from './Logo';

export const NAV_LINKS = [
  { to: '/#nabidka', label: 'Nabídka' },
  { to: '/#svatby', label: 'Svatby a výslužky' },
  { to: '/#o-nas', label: 'O nás' },
  { to: '/#galerie', label: 'Galerie' },
  { to: '/#jak-objednat', label: 'Jak objednat' },
  { to: '/#kontakty', label: 'Kontakty' },
];

export function Header() {
  const { itemCount } = useOrder();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open ? 'bg-cream-100/90 shadow-[0_1px_0_rgb(59_36_24/0.08)] backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <a
        href="#obsah"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-cocoa-900 focus:px-4 focus:py-2 focus:text-cream-50"
      >
        Přeskočit na obsah
      </a>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link to="/" className="shrink-0" aria-label={`${business.name} – úvod`}>
          <Logo />
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="rounded-full px-3 py-2 text-[0.92rem] font-semibold text-cocoa-700 transition hover:bg-cocoa-800/5 hover:text-cocoa-900">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${business.phones.orders.tel}`} className="btn-ghost btn-sm hidden xl:inline-flex">
            <PhoneIcon size={18} />
            {business.phones.orders.display}
          </a>
          <Link to="/objednavka" className="btn-primary btn-sm">
            <BagIcon size={18} />
            <span className="hidden sm:inline">Objednat</span>
            {itemCount > 0 && (
              <span className="ml-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-raspberry-700">
                <span className="sr-only">položek v objednávce: </span>
                {itemCount}
              </span>
            )}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-900 hover:bg-cocoa-800/5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobilni-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            <span className="sr-only">{open ? 'Zavřít menu' : 'Otevřít menu'}</span>
          </button>
        </div>
      </div>

      <div id="mobilni-menu" hidden={!open} className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-cream-100 lg:hidden">
        <nav aria-label="Mobilní navigace" className="container-page py-6">
          <ul className="divide-y divide-cocoa-800/10">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="block py-4 font-display text-2xl text-cocoa-900">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <Link to="/objednavka" className="btn-primary">
              <BagIcon size={18} /> Sestavit objednávku
            </Link>
            <a href={`tel:${business.phones.orders.tel}`} className="btn-secondary">
              <PhoneIcon size={18} /> Zavolat {business.phones.orders.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
