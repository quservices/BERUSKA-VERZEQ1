import { Link } from 'react-router';
import { Ladybug } from '../components/ui/Icons';

export function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center py-28 pb-36 text-center">
      <title>Stránka nenalezena – Cukrárna Beruška</title>
      <meta name="robots" content="noindex" />
      <Ladybug size={64} className="text-raspberry-500" />
      <h1 className="mt-6 text-5xl font-medium">Tahle stránka nám utekla</h1>
      <p className="mt-4 max-w-md text-lg text-cocoa-700">Možná se jen schovala mezi koláči. Zkuste se vrátit na úvod.</p>
      <Link to="/" className="btn-primary mt-8">
        Zpět na úvod
      </Link>
    </div>
  );
}
