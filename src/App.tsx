import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from './components/layout/Layout';
import { OrderProvider } from './order/store';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Objednávkový systém a právní stránky se načítají až při návštěvě – úvodní stránka je tak rychlejší.
const OrderPage = lazy(() => import('./pages/OrderPage').then((m) => ({ default: m.OrderPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const CookiesPage = lazy(() => import('./pages/CookiesPage').then((m) => ({ default: m.CookiesPage })));

function PageLoading() {
  return (
    <div className="container-page py-28 text-center text-cocoa-600" role="status">
      Načítám…
    </div>
  );
}

export function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="objednavka" element={<OrderPage />} />
              <Route path="ochrana-osobnich-udaju" element={<PrivacyPage />} />
              <Route path="cookies" element={<CookiesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </OrderProvider>
  );
}
