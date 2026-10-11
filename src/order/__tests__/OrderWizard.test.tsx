import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderWizard } from '../OrderWizard';
import { OrderProvider } from '../store';
import { SubmitError, type OrderSubmitter } from '../submit';
import { emptyOrder } from '../types';

const TODAY = '2026-10-11';

function setup(submitter: OrderSubmitter) {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <OrderProvider initialState={emptyOrder(Date.now() - 60_000)}>
        <OrderWizard submitter={submitter} today={TODAY} />
      </OrderProvider>
    </MemoryRouter>,
  );
  return user;
}

const next = () => screen.getByRole('button', { name: /Pokračovat/ });

async function fillOrder(user: ReturnType<typeof userEvent.setup>) {
  // 1) typ
  await user.click(screen.getByLabelText(/Běžná objednávka/));
  await user.click(next());

  // 2) výrobky – tři různé druhy, úprava množství, odebrání
  await user.click(screen.getByRole('button', { name: 'Přidat do objednávky: Tvarohový koláč' }));
  await user.click(screen.getByRole('button', { name: 'Přidat do objednávky: Makový koláč' }));
  await user.click(screen.getByRole('button', { name: 'Chlebíčky' }));
  await user.click(screen.getByRole('button', { name: 'Přidat do objednávky: Chlebíček šunka na salátu' }));
  await user.click(screen.getByRole('button', { name: 'Přidat – Tvarohový koláč' }));
  await user.click(screen.getByRole('button', { name: 'Přidat – Tvarohový koláč' }));
  expect(screen.getByLabelText(/Množství – Tvarohový koláč/)).toHaveValue('3');
  await user.click(screen.getByRole('button', { name: 'Odebrat z objednávky: Makový koláč' }));
  expect(screen.queryByRole('button', { name: 'Odebrat z objednávky: Makový koláč' })).not.toBeInTheDocument();
  await user.click(next());

  // 3) podrobnosti
  await user.type(screen.getByLabelText(/Další přání/), 'Prosím do krabice.');
  await user.click(next());

  // 4) vyzvednutí
  await user.click(screen.getByLabelText(/Prodejna Paskov/));
  fireEvent.change(screen.getByLabelText(/Preferované datum/), { target: { value: '2026-10-13' } });
  await user.selectOptions(screen.getByLabelText(/Preferovaný čas/), '07:30');
  await user.click(next());

  // 5) kontakt – nejdřív chybně, pak správně
  await user.type(screen.getByLabelText(/Jméno a příjmení/), 'Jana Nováková');
  await user.type(screen.getByLabelText(/^Telefon/), '123');
  await user.type(screen.getByLabelText(/^E-mail/), 'jana@seznam.cz');
  await user.click(next());
  expect(await screen.findByText(/Zadejte telefon ve tvaru/)).toBeInTheDocument();
  expect(screen.getByText(/Bez souhlasu se zpracováním/)).toBeInTheDocument();
  await user.clear(screen.getByLabelText(/^Telefon/));
  await user.type(screen.getByLabelText(/^Telefon/), '775 982 575');
  await user.click(screen.getByLabelText(/Souhlasím se zpracováním/));
  await user.click(next());
}

describe('objednávkový konfigurátor', () => {
  beforeEach(() => localStorage.clear());

  it('projde celou objednávkou a v ukázkovém režimu NEhlásí přijetí', async () => {
    const submit = vi.fn<OrderSubmitter['submit']>().mockResolvedValue({ status: 'demo', reference: 'UKÁZKA-TEST' });
    const user = setup({ mode: 'demo', submit });
    await fillOrder(user);

    // 6) souhrn
    const summary = screen.getByRole('heading', { name: /Souhrn/ }).closest('form')!;
    expect(within(summary).getByText('Tvarohový koláč')).toBeInTheDocument();
    expect(within(summary).getByText('Chlebíček šunka na salátu')).toBeInTheDocument();
    expect(within(summary).getByText(/118\s*Kč/)).toBeInTheDocument(); // 3 × 27 + 37
    expect(within(summary).queryByText('Makový koláč')).not.toBeInTheDocument();

    // návrat zpět a úprava je možná
    await user.click(within(summary).getByRole('button', { name: /Upravit – Výrobky/ }));
    expect(screen.getByRole('heading', { name: /Výrobky/ })).toBeInTheDocument();
    for (let i = 0; i < 4; i++) await user.click(next());

    await user.click(screen.getByRole('button', { name: /Odeslat objednávku/ }));
    expect(await screen.findByText('Objednávka nebyla nikam odeslána')).toBeInTheDocument();
    expect(screen.queryByText(/objednávku jsme přijali/)).not.toBeInTheDocument();

    expect(submit).toHaveBeenCalledOnce();
    const payload = submit.mock.calls[0][0];
    expect(payload.items.map((i) => [i.productId, i.qty])).toEqual([
      ['kolac-tvarohovy', 3],
      ['chlebicek-sunka-salat', 1],
    ]);
    expect(payload.pickup).toEqual({ place: 'paskov', date: '2026-10-13', time: '07:30' });
    expect(payload.customer.phone).toBe('775 982 575');
  });

  it('při chybě serveru zobrazí chybu a žádné potvrzení', async () => {
    const submit = vi.fn<OrderSubmitter['submit']>().mockRejectedValue(new SubmitError('Objednávku se nepodařilo uložit.'));
    const user = setup({ mode: 'api', submit });
    await fillOrder(user);
    await user.click(screen.getByRole('button', { name: /Odeslat objednávku/ }));
    expect(await screen.findByText('Objednávku se nepodařilo uložit.')).toBeInTheDocument();
    expect(screen.queryByText(/přijali k vyřízení/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Odeslat objednávku/ })).toBeEnabled();
  });

  it('nepustí dál bez výběru typu a bez výrobků', async () => {
    const user = setup({ mode: 'demo', submit: vi.fn() });
    await user.click(next());
    expect(await screen.findByText('Vyberte typ objednávky.')).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Běžná objednávka/));
    await user.click(next());
    await user.click(next());
    expect(await screen.findByText(/alespoň jeden výrobek/)).toBeInTheDocument();
  });
});
