import { Link } from 'react-router';
import { business } from '../../data/business';
import { FAVOR_LIMITS, FAVOR_SHEET_PDF, WEDDING } from '../../data/orderRules';
import { formatCzk } from '../../lib/format';
import { ArrowRightIcon, ExternalIcon, PhoneIcon } from '../ui/Icons';
import { Photo } from '../ui/Photo';
import { Reveal } from '../ui/Reveal';

const OFFER = [
  {
    title: 'Svatební koláče',
    text: 'Stejné koláče, jaké pečeme každý den – pro svatby vybíráme ty nejpovedenější kousky. Menší koláčky rádi individuálně naceníme.',
  },
  {
    title: 'Výslužky',
    text: `Celofánové výslužky po ${FAVOR_LIMITS.min}–${FAVOR_LIMITS.max} koláčích se stuhou, krajkou a táckem, nebo výslužky do krabiček. Doplníme marcipánovým či perníkovým srdíčkem a cukrovím.`,
  },
  {
    title: 'Svatební dort',
    text: `Dort podle vaší inspirace, finální zdobení čerstvým ovocem a květinami až v den předání. Předáváme v chladicím termoboxu (vratná záloha ${formatCzk(WEDDING.thermoboxDeposit)}).`,
  },
  {
    title: 'Sweet bar trochu jinak',
    text: 'Mini koblihy, vdolky, ovocné koláče, kremrole, mrkvánky nebo mini zákusky. Tradiční české sladkosti, které překvapí i zahraniční hosty.',
  },
];

export function Weddings() {
  return (
    <section id="svatby" aria-labelledby="svatby-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <p className="eyebrow">Svatby a výslužky</p>
            <h2 id="svatby-title" className="section-title mt-3">
              Sladké pohoštění pro váš velký den
            </h2>
            <p className="mt-5 text-lg text-cocoa-700">
              Koláče a pečivo připravujeme v nočních hodinách, aby byly na váš svatební den co nejčerstvější. Při objednávce nám proto prosím
              uveďte, zda si ji vyzvednete v den svatby, nebo den předem.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link to="/objednavka?typ=svatba" className="btn-primary">
              Poptat svatbu <ArrowRightIcon size={18} />
            </Link>
            <a href={`tel:${business.phones.special.tel}`} className="btn-secondary">
              <PhoneIcon size={18} /> {business.phones.special.display}
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:min-h-[32rem]">
            <Photo
              image="gallery/dort-ruze-patrovy"
              alt="Patrový svatební dort s bílými růžemi"
              className="aspect-[4/5] w-full rounded-(--radius-photo) shadow-(--shadow-lift) lg:aspect-auto lg:h-full"
              sizes="(min-width: 1024px) 38vw, 90vw"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {OFFER.map((o, i) => (
              <Reveal key={o.title} delay={i * 80} className="card p-6">
                <h3 className="text-2xl font-medium">{o.title}</h3>
                <p className="mt-3 text-cocoa-700">{o.text}</p>
              </Reveal>
            ))}
            <Reveal className="grid grid-cols-3 gap-3 sm:col-span-2">
              <Photo image="gallery/vysluzka-celofan" alt="Celofánová výslužka s koláči" className="aspect-square rounded-2xl" sizes="20vw" />
              <Photo image="products/srdicko-zlate" alt="Marcipánové srdíčko ve zlatém provedení" className="aspect-square rounded-2xl" sizes="20vw" />
              <Photo image="gallery/vysluzka-srdicko" alt="Výslužka v krabičce s perníkovým srdíčkem" className="aspect-square rounded-2xl" sizes="20vw" />
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-8 flex flex-col gap-2 text-sm text-cocoa-700 sm:flex-row sm:items-center sm:gap-6">
          <span>Složitější výslužky? Vyplňte tabulku s rozpisem:</span>
          <a href={FAVOR_SHEET_PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-raspberry-700 underline underline-offset-4">
            Rozpis výslužek (PDF) <ExternalIcon size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
