import { Link } from 'react-router';
import { business } from '../../data/business';
import { CAKE_DEPOSIT, KOLACE_RULES, LEAD_DAYS } from '../../data/orderRules';
import { formatCzk } from '../../lib/format';
import { ArrowRightIcon, PhoneIcon } from '../ui/Icons';
import { Notice } from '../ui/Field';
import { Reveal } from '../ui/Reveal';

const STEPS = [
  {
    title: 'Vyberte výrobky',
    text: 'Projděte nabídku a sestavte si objednávku na webu, nebo nám rovnou zavolejte. Každý výrobek může mít jiné množství.',
  },
  {
    title: 'Pošlete poptávku',
    text: 'Zvolte typ objednávky, preferovaný termín a místo vyzvednutí. Běžné objednávky a dorty řeší prodejna, svatby a výslužky paní Čuboň.',
  },
  {
    title: 'Potvrdíme termín',
    text: 'Ozveme se vám s potvrzením dostupnosti, ceny a případné zálohy. Teprve potvrzením je objednávka závazná.',
  },
  {
    title: 'Vyzvedněte si dobroty',
    text: 'V prodejně v Paskově, nebo ve výrobně v Žabni (úterý–pátek 6–10 h, sobota 7–9 h).',
  },
];

const RULES = [
  `Koláče nepřizpůsobujeme (náplně, velikost) – prosíme, respektujte naše receptury.`,
  `Nad ${KOLACE_RULES.depositThreshold} koláčů přijímáme zálohu cca ${formatCzk(KOLACE_RULES.depositApprox)}, u dortů ${formatCzk(CAKE_DEPOSIT.min)}–${formatCzk(CAKE_DEPOSIT.max)}.`,
  `Dort s jedlým papírem objednávejte alespoň ${LEAD_DAYS.ediblePaper} dní předem, výslužky do krabiček a ozdoby na dort týden předem.`,
  'Složitější objednávky (svatby, výslužky) přijímáme také e-mailem – můžete přiložit i fotografii inspirace.',
];

export function HowToOrder() {
  const phones = [business.phones.orders, business.phones.production, business.phones.special];
  return (
    <section id="jak-objednat" aria-labelledby="jak-objednat-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Jak objednat</p>
          <h2 id="jak-objednat-title" className="section-title mt-3">
            Objednávka ve čtyřech krocích
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="card relative p-6 pt-14">
              <span className="absolute top-5 left-6 font-display text-4xl font-semibold text-raspberry-200" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] text-cocoa-700">{s.text}</p>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="card p-7">
            <h3 className="text-2xl font-medium">Dobré vědět</h3>
            <ul className="mt-4 space-y-3 text-cocoa-700">
              {RULES.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-raspberry-500" />
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Notice tone="demo" title="Web je zatím ve zkušebním provozu">
                <p>Online objednávku si můžete vyzkoušet, ale zatím se nikam neodesílá. Pro skutečnou objednávku nám prosím zavolejte.</p>
              </Notice>
            </div>
          </Reveal>

          <Reveal delay={120} className="rounded-[1.5rem] bg-raspberry-600 p-7 text-white">
            <h3 className="text-2xl font-medium text-white">Raději po telefonu?</h3>
            <p className="mt-2 text-raspberry-50">{business.phoneOrdersNote}</p>
            <ul className="mt-6 space-y-4">
              {phones.map((p) => (
                <li key={p.tel}>
                  <span className="block text-sm text-raspberry-100">
                    {p.label}
                    {'person' in p && p.person ? ` – ${p.person}` : ''}
                  </span>
                  <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 text-2xl font-semibold tabular-nums hover:underline">
                    <PhoneIcon size={20} /> {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/objednavka" className="btn mt-8 bg-white text-raspberry-700 hover:bg-cream-100">
              Sestavit objednávku online <ArrowRightIcon size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
