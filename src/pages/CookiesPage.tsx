import { LegalLayout } from './LegalLayout';

export function CookiesPage() {
  return (
    <LegalLayout title="Cookies a úložiště prohlížeče">
      <p>
        Tento web <strong>nepoužívá analytické ani reklamní cookies</strong>, a proto nezobrazuje lištu se souhlasem.
      </p>
      <h2>Co si web ukládá</h2>
      <ul>
        <li>
          <strong>Rozpracovaná objednávka</strong> – ukládá se do místního úložiště vašeho prohlížeče (localStorage), abyste o ni nepřišli. Neobsahuje
          souhlas se zpracováním údajů a nikam se neodesílá. Smažete ji tlačítkem „Začít novou objednávku“ nebo vymazáním dat prohlížeče.
        </li>
      </ul>
      <h2>Služby třetích stran</h2>
      <ul>
        <li>
          <strong>Mapa Google</strong> – načte se až po kliknutí na „Zobrazit mapu“ v sekci Kontakty. Poté může Google ukládat vlastní cookies podle svých
          zásad.
        </li>
        <li>
          <strong>Odkazy na Facebook, Mapy.cz a Google Maps</strong> – otevírají se na webu dané služby. Dokud na ně nekliknete, nic se z nich nenačítá.
        </li>
      </ul>
    </LegalLayout>
  );
}
