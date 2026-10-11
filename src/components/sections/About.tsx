import { Reveal } from '../ui/Reveal';
import { Photo } from '../ui/Photo';

const TIMELINE = [
  { year: '1997', title: 'Otevíráme', text: 'Naše provozovna byla otevřena 13. 3. 1997. Začátky nebyly jednoduché, ale věřili jsme své práci.' },
  {
    year: 'Další léta',
    title: 'Poctivá výroba',
    text: 'Zakládali jsme si na koláčích, čajovém pečivu a výrobcích podle přání zákazníků. Nikdy jsme neusilovali o velkovýrobu.',
  },
  {
    year: '2025–2026',
    title: 'Nová výrobna',
    text: 'Díky nové výrobně jsme rozšířili nabídku o čerstvé pečivo, chleba a koblihy a začali vyrábět vlastní zákusky.',
  },
  { year: '15. 1. 2026', title: 'Prodejna v Paskově', text: 'Prodejnu jsme přestěhovali ze Sviadnova do Paskova. Začala nová etapa celé cukrárny.' },
];

export function About() {
  return (
    <section id="o-nas" aria-labelledby="o-nas-title" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal className="relative">
          <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-28">
            <Photo
              image="products/kolac-tvarohovy"
              alt="Tvarohový koláč na talířku"
              className="aspect-[3/4] rounded-(--radius-photo) shadow-(--shadow-lift)"
              sizes="(min-width: 1024px) 20vw, 45vw"
            />
            <Photo
              image="gallery/kolacky-pivonky"
              alt="Koláčky na prkénku vedle kytice pivoněk"
              className="mt-12 aspect-[3/4] rounded-(--radius-photo) shadow-(--shadow-lift)"
              sizes="(min-width: 1024px) 20vw, 45vw"
            />
            <blockquote className="col-span-2 mt-4 rounded-[1.5rem] bg-cocoa-900 p-7 text-cream-100">
              <p className="font-display text-2xl leading-snug italic">
                „Přesto u nás stále vítězí klasika. Poctivě plněné koláče, které jsou s námi od začátku.“
              </p>
              <footer className="mt-4 text-sm text-cream-300">— Helena Míčková, zakladatelka cukrárny</footer>
            </blockquote>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">O nás</p>
            <h2 id="o-nas-title" className="section-title mt-3">
              Rodinná cukrárna, kde se náplň nehledá
            </h2>
            <div className="prose-beruska mt-6 text-lg text-cocoa-700">
              <p>
                Když jsme cukrárnu otevírali, vůbec jsme netušili, kam až nás naše cesta zavede. Jedno jsme ale věděli jistě – pokud budeme
                svou práci dělat poctivě, s pokorou a úctou k zákazníkům, najdeme si své místo.
              </p>
              <p>
                Postupně jsme si získali zákazníky nejen v okolních vesnicích, ale i daleko za hranicemi regionu. Naše výrobky putovaly po celé
                České republice, do zemí Evropské unie i mimo ni.
              </p>
              <p>
                Firmu postupně převzala dcera zakladatelky Andrea, která byla v provozu prakticky od samého začátku. A do řemesla se pomalu
                zapojuje i další generace. Historie se tak opakuje – a naše rodinná cukrárna pokračuje dál.
              </p>
            </div>
          </Reveal>

          <ol className="relative mt-12 space-y-8 border-l-2 border-raspberry-100 pl-8">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 80} className="relative">
                <span aria-hidden="true" className="absolute top-1.5 -left-[2.55rem] h-4 w-4 rounded-full border-4 border-cream-50 bg-raspberry-500" />
                <p className="text-sm font-bold tracking-wider text-raspberry-600 uppercase">{t.year}</p>
                <h3 className="mt-1 text-2xl font-medium">{t.title}</h3>
                <p className="mt-2 text-cocoa-700">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
