import { Notice } from '../components/ui/Field';
import { business } from '../data/business';
import { LegalLayout } from './LegalLayout';

export function PrivacyPage() {
  const { operator } = business;
  return (
    <LegalLayout title="Ochrana osobních údajů">
      <Notice tone="warning" title="Návrh textu – před spuštěním webu nutno schválit provozovatelem">
        <p>Údaje v hranatých závorkách je třeba doplnit. Text nenahrazuje právní posouzení.</p>
      </Notice>

      <h2>Správce osobních údajů</h2>
      <p>
        {operator.name}, {operator.address}, IČO {operator.ico} (dále „{business.name}“). Kontakt: {business.email}, tel.{' '}
        {business.phones.orders.display}.
      </p>

      <h2>Jaké údaje zpracováváme a proč</h2>
      <p>Při odeslání objednávky přes web zpracováváme pouze údaje nutné k jejímu vyřízení:</p>
      <ul>
        <li>jméno a příjmení,</li>
        <li>telefon a e-mail – abychom vám mohli potvrdit termín, cenu a případnou zálohu,</li>
        <li>obsah objednávky, preferovaný termín a místo vyzvednutí a vaše poznámky.</li>
      </ul>
      <p>
        Právním základem je jednání o uzavření a plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR). Údaje nepoužíváme k marketingu a nepředáváme je třetím
        stranám k jejich vlastním účelům.
      </p>

      <h2>Jak dlouho údaje uchováváme</h2>
      <p>Údaje uchováváme po dobu vyřízení objednávky a dále po dobu [doplní provozovatel – např. dle účetních a daňových předpisů].</p>

      <h2>Kdo má k údajům přístup</h2>
      <p>
        Pouze pověření pracovníci cukrárny a technický poskytovatel webu a databáze, který údaje zpracovává jen podle našich pokynů [doplnit
        poskytovatele hostingu po spuštění].
      </p>

      <h2>Vaše práva</h2>
      <ul>
        <li>požadovat přístup ke svým údajům, jejich opravu nebo výmaz,</li>
        <li>požadovat omezení zpracování a vznést námitku,</li>
        <li>na přenositelnost údajů,</li>
        <li>podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz).</li>
      </ul>
      <p>Své požadavky nám pošlete e-mailem na {business.email}.</p>

      <h2>Ukázkový režim webu</h2>
      <p>
        V současné verzi webu se objednávkový formulář nikam neodesílá a údaje se neukládají na žádný server. Rozpracovaná objednávka (bez souhlasu)
        se ukládá pouze ve vašem prohlížeči, abyste o ni nepřišli při obnovení stránky.
      </p>
    </LegalLayout>
  );
}
