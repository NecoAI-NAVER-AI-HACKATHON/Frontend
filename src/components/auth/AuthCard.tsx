// components/auth/AuthCard.tsx
"use client";

import * as React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-sky-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/90 dark:bg-zinc-900/90 shadow-xl ring-1 ring-black/5 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold">
              NecoAI
            </div>
            {subtitle ? (
              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          {children}

          {footer ? <div className="mt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
