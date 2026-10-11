import { useSearchParams } from 'react-router';
import { OrderWizard } from '../order/OrderWizard';
import { ORDER_TYPES, type OrderType } from '../order/types';

export function OrderPage() {
  const [params] = useSearchParams();
  const typ = params.get('typ');
  const initialType = ORDER_TYPES.some((t) => t.id === typ) ? (typ as OrderType) : undefined;
  return (
    <div className="container-page pt-6 pb-24 sm:pt-10">
      <title>Objednávka – Cukrárna Beruška Paskov</title>
      <meta name="description" content="Sestavte si objednávku koláčů, zákusků, dortu na míru nebo svatebních výslužek z Cukrárny Beruška v Paskově." />
      <p className="eyebrow">Objednávka</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">Sestavte si objednávku</h1>
      <p className="mt-3 max-w-2xl text-lg text-cocoa-700">
        Vyberte výrobky, preferovaný termín a místo vyzvednutí. Objednávku vám potvrdíme – teprve potom je závazná.
      </p>
      <div className="mt-8">
        <OrderWizard initialType={initialType} />
      </div>
    </div>
  );
}
