import type { ReactNode } from 'react';

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="container-page max-w-3xl pt-10 pb-24 sm:pt-16">
      <title>{`${title} – Cukrárna Beruška`}</title>
      <p className="eyebrow">Informace</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{title}</h1>
      <div className="mt-8 space-y-6 text-[1.02rem] text-cocoa-800 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  );
}
