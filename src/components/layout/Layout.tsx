import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { business } from '../../data/business';
import { useOrder } from '../../order/store';
import { BagIcon, PhoneIcon } from '../ui/Icons';
import { Footer } from './Footer';
import { Header } from './Header';

/** Po změně stránky posune na začátek, případně na kotvu (#nabidka apod.). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView());
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function MobileActionBar() {
  const { pathname } = useLocation();
  const { itemCount } = useOrder();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cocoa-800/10 bg-cream-50/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a href={`tel:${business.phones.orders.tel}`} className="btn-secondary flex-1 px-3">
          <PhoneIcon size={18} /> Zavolat
        </a>
        {pathname !== '/objednavka' && (
          <Link to="/objednavka" className="btn-primary flex-1 px-3">
            <BagIcon size={18} /> Objednat{itemCount > 0 ? ` (${itemCount})` : ''}
          </Link>
        )}
      </div>
    </div>
  );
}

export function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="obsah" tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
