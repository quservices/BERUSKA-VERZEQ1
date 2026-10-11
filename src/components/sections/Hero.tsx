import { Link } from 'react-router';
import { business } from '../../data/business';
import { ArrowRightIcon, Ladybug, PhoneIcon } from '../ui/Icons';
import { Photo } from '../ui/Photo';

const FACTS = [
  { value: `od ${business.foundedYear}`, label: 'rodinná tradice' },
  { value: 'vlastní', label: 'receptury' },
  { value: 'ruční', label: 'výroba' },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 h-[38rem] w-[38rem] rounded-full bg-raspberry-100/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-80 -left-40 h-[28rem] w-[28rem] rounded-full bg-cream-300/50 blur-3xl" />

      <div className="container-page relative grid items-center gap-14 pt-8 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-14 lg:pb-28">
        <div className="animate-float-in">
          <p className="eyebrow flex items-center gap-2">
            <Ladybug size={20} className="text-raspberry-500" />
            Rodinná cukrárna · Paskov
          </p>
          <h1 id="hero-title" className="mt-5 text-[2.9rem] leading-[1.02] font-medium sm:text-6xl lg:text-[4.6rem]" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
            Poctivě plněné.
            <br />
            <em className="font-normal text-raspberry-600 italic">Ručně</em> dělané.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cocoa-700">
            Koláče, zákusky, dorty na míru i svatební výslužky podle vlastních receptur – pečeme od roku {business.foundedYear}.
            U nás se náplň opravdu nehledá. Najdete nás nově na náměstí v Paskově.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/#nabidka" className="btn-secondary">
              Prohlédnout nabídku
            </Link>
            <Link to="/objednavka" className="btn-primary">
              Objednat výrobky <ArrowRightIcon size={18} />
            </Link>
          </div>

          <a
            href={`tel:${business.phones.orders.tel}`}
            className="group mt-7 inline-flex items-center gap-3 text-cocoa-800"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-(--shadow-soft) transition group-hover:bg-raspberry-600 group-hover:text-white">
              <PhoneIcon size={18} />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-semibold tracking-wide text-cocoa-500 uppercase">Objednávky po telefonu</span>
              <span className="text-lg font-bold tabular-nums">{business.phones.orders.display}</span>
            </span>
          </a>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-cocoa-800/10 pt-6">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold text-cocoa-900">{f.value}</span>
                  <span className="text-sm text-cocoa-600">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl grid-cols-[1.15fr_1fr] gap-4 sm:gap-5" aria-label="Ukázky našich výrobků">
          <Photo
            image="gallery/dort-fiky-patrovy"
            alt="Patrový dort zdobený fíky, jahodami a borůvkami"
            priority
            sizes="(min-width: 1024px) 28vw, 55vw"
            className="row-span-2 aspect-[3/4] animate-float-in rounded-(--radius-photo) shadow-(--shadow-lift) [animation-delay:120ms]"
          />
          <Photo
            image="products/kolac-orechovy"
            alt="Rozpůlený ořechový koláč s povidly"
            priority
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="aspect-square animate-float-in rounded-(--radius-photo) shadow-(--shadow-lift) [animation-delay:260ms]"
          />
          <Photo
            image="products/koblihy"
            alt="Koblihy s různými náplněmi"
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="aspect-square animate-float-in rounded-(--radius-photo) shadow-(--shadow-lift) [animation-delay:400ms]"
          />
          <div className="absolute -bottom-6 left-4 max-w-[15rem] animate-float-in rounded-2xl bg-white/95 p-4 shadow-(--shadow-lift) backdrop-blur [animation-delay:600ms] sm:-left-6">
            <p className="text-xs font-bold tracking-wider text-raspberry-600 uppercase">Nově od 15. 1. 2026</p>
            <p className="mt-1 text-sm font-semibold text-cocoa-900">Prodejna na Náměstí 44 v Paskově</p>
          </div>
        </div>
      </div>
    </section>
  );
}
