import type { OrderPayload } from './payload';

export type SubmitResult =
  /** Ukázkový režim – objednávka NEBYLA nikam odeslána. */
  | { status: 'demo'; reference: string }
  /** Server objednávku uložil a přijal k vyřízení. */
  | { status: 'accepted'; reference: string };

export interface OrderSubmitter {
  mode: 'demo' | 'api';
  submit(payload: OrderPayload): Promise<SubmitResult>;
}

export class SubmitError extends Error {}

/** Výchozí režim návrhu: nic se neodesílá, jen simulujeme krátké zpracování. */
export const demoSubmitter: OrderSubmitter = {
  mode: 'demo',
  async submit() {
    await new Promise((r) => setTimeout(r, 700));
    return { status: 'demo', reference: `UKÁZKA-${Date.now().toString(36).toUpperCase().slice(-6)}` };
  },
};

/** Napojení na budoucí Node server. Za úspěch považujeme jen odpověď 2xx s číslem objednávky. */
export function httpSubmitter(url: string): OrderSubmitter {
  return {
    mode: 'api',
    async submit(payload) {
      let res: Response;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        throw new SubmitError('Nepodařilo se spojit se serverem. Zkontrolujte připojení k internetu, nebo nám zavolejte.');
      }
      const data = (await res.json().catch(() => null)) as { reference?: string; message?: string } | null;
      if (!res.ok || !data?.reference) {
        throw new SubmitError(data?.message ?? 'Objednávku se nepodařilo uložit. Zkuste to prosím znovu, nebo nám zavolejte.');
      }
      return { status: 'accepted', reference: data.reference };
    },
  };
}

export function createSubmitter(apiUrl: string | undefined = import.meta.env.VITE_ORDER_API_URL): OrderSubmitter {
  return apiUrl ? httpSubmitter(apiUrl) : demoSubmitter;
}
