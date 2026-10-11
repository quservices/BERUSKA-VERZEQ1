import { useState } from 'react';
import { business, DAY_NAMES, formatIntervals, fullAddress, WEEK_ORDER, type Location } from '../../data/business';
import { ClockIcon, ExternalIcon, MailIcon, MapPinIcon, PhoneIcon } from '../ui/Icons';
import { Reveal } from '../ui/Reveal';

function HoursTable({ loc }: { loc: Location }) {
  const today = new Date().getDay();
  return (
    <table className="w-full text-[0.95rem]">
      <caption className="sr-only">Otevírací doba – {loc.name}</caption>
      <tbody>
        {WEEK_ORDER.map((d) => (
          <tr key={d} className={d === today ? 'font-bold text-cocoa-900' : 'text-cocoa-700'}>
            <th scope="row" className="py-1 pr-4 text-left font-[inherit]">
              {DAY_NAMES[d]}
              {d === today && <span className="ml-2 rounded-full bg-raspberry-100 px-2 py-0.5 text-[0.7rem] text-raspberry-700">dnes</span>}
            </th>
            <td className="py-1 text-right tabular-nums">{formatIntervals(loc.hours[d] ?? [])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MapEmbed({ loc }: { loc: Location }) {
  const [loaded, setLoaded] = useState(false);
  const q = encodeURIComponent(loc.mapQuery);
  if (!loaded) {
    return (
      <div className="paper flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-2xl bg-cream-200 p-6 text-center">
        <MapPinIcon size={28} className="text-raspberry-600" />
        <p className="max-w-xs text-sm text-cocoa-700">Mapa se načítá ze služby Google Maps až po kliknutí.</p>
        <button type="button" className="btn-secondary btn-sm" onClick={() => setLoaded(true)}>
          Zobrazit mapu
        </button>
      </div>
    );
  }
  return (
    <iframe
      title={`Mapa – ${loc.name}`}
      src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
      className="aspect-[16/10] w-full rounded-2xl border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function Contact() {
  const locations = [business.locations.paskov, business.locations.zaben];
  return (
    <section id="kontakty" aria-labelledby="kontakty-title" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Kontakty</p>
          <h2 id="kontakty-title" className="section-title mt-3">
            Zastavte se u nás
          </h2>
          <p className="mt-4 text-lg text-cocoa-700">
            Prodejna ve Sviadnově je trvale uzavřena – od 15. 1. 2026 nás najdete na náměstí v Paskově.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {locations.map((loc, i) => {
            const q = encodeURIComponent(loc.mapQuery);
            return (
              <Reveal key={loc.id} delay={i * 100} className="card flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-medium">{loc.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-cocoa-800">
                      <MapPinIcon size={18} className="shrink-0 text-raspberry-600" /> {fullAddress(loc)}
                    </p>
                    <p className="mt-1 text-sm text-cocoa-600">{loc.description}</p>
                    {loc.pickupNote && <p className="mt-1 text-sm font-semibold text-cocoa-700">{loc.pickupNote}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-sans text-sm font-bold tracking-wider text-cocoa-600 uppercase">
                    <ClockIcon size={16} /> Otevírací doba
                  </h4>
                  <HoursTable loc={loc} />
                  {loc.id === 'paskov' && (
                    <p className="mt-2 text-xs text-cocoa-600">Ve všední dny polední pauza 12:00–12:30. Svátky a uzavírky sledujte na Facebooku.</p>
                  )}
                </div>
                <MapEmbed loc={loc} />
                <div className="flex flex-wrap gap-2">
                  <a href={`https://mapy.cz/zakladni?q=${q}`} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                    Mapy.cz <ExternalIcon size={16} />
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary btn-sm"
                  >
                    Navigovat <ExternalIcon size={16} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-6 grid gap-6 md:grid-cols-3">
          {Object.values(business.phones).map((p) => (
            <div key={p.tel} className="card p-6">
              <p className="text-sm text-cocoa-600">
                {p.label}
                {'person' in p && p.person ? ` – ${p.person}` : ''}
              </p>
              <a href={`tel:${p.tel}`} className="mt-1 inline-flex items-center gap-2 text-2xl font-semibold text-cocoa-900 tabular-nums hover:text-raspberry-700">
                <PhoneIcon size={20} /> {p.display}
              </a>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-cocoa-800/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2 text-lg font-semibold text-cocoa-900 hover:text-raspberry-700">
            <MailIcon size={20} /> {business.email}
          </a>
          <p className="text-sm text-cocoa-600">
            Provozovatel: {business.operator.name}, {business.operator.address}, IČO {business.operator.ico}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
