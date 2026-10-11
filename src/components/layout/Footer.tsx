import { Link } from 'react-router';
import { business, formatIntervals, fullAddress } from '../../data/business';
import { FacebookIcon, MailIcon, PhoneIcon } from '../ui/Icons';
import { NAV_LINKS } from './Header';
import { Logo } from './Logo';

export function Footer() {
  const { paskov, zaben } = business.locations;
  return (
    <footer className="bg-cocoa-900 pb-28 text-cream-200 lg:pb-12">
      <div className="container-page grid gap-12 pt-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-2xl bg-cream-100 px-4 py-3">
            <Logo compact />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-300">
            Rodinná cukrárna od roku {business.foundedYear}. Vlastní receptury, ruční výroba a poctivě plněné koláče.
          </p>
          <a
            href={business.facebook}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cream-50 hover:text-raspberry-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon size={18} /> Sledujte nás na Facebooku
          </a>
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-cream-400 uppercase">Kontakt</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {Object.values(business.phones).map((p) => (
              <li key={p.tel}>
                <span className="block text-cream-400">{p.label}</span>
                <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 font-semibold text-cream-50 hover:text-raspberry-200">
                  <PhoneIcon size={16} /> {p.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2 font-semibold text-cream-50 hover:text-raspberry-200">
                <MailIcon size={16} /> {business.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-cream-400 uppercase">Kde nás najdete</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {[paskov, zaben].map((loc) => (
              <li key={loc.id}>
                <span className="font-semibold text-cream-50">{loc.name}</span>
                <br />
                {fullAddress(loc)}
                <br />
                <span className="text-cream-400">Út–Pá {formatIntervals(loc.hours[2])}</span>
              </li>
            ))}
            <li className="text-cream-400">
              {business.closedLocation.address} – trvale uzavřeno.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-cream-400 uppercase">Rozcestník</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm lg:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-cream-50">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/objednavka" className="hover:text-cream-50">
                Objednávka
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-14 flex flex-col gap-4 border-t border-cream-50/10 pt-6 text-xs text-cream-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {business.name} · Provozovatel: {business.operator.name}, {business.operator.address}, IČO{' '}
          {business.operator.ico}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link to="/ochrana-osobnich-udaju" className="hover:text-cream-50">
              Ochrana osobních údajů
            </Link>
          </li>
          <li>
            <Link to="/cookies" className="hover:text-cream-50">
              Cookies
            </Link>
          </li>
          <li>
            <a href={business.officialWeb} className="hover:text-cream-50" rel="noopener">
              Původní web
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
