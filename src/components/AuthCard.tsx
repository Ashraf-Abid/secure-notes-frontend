import { ReactNode } from 'react';

export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        <h1 className="mb-1 text-center text-lg font-semibold">Secure Notes</h1>
        <h2 className="mb-4 text-center text-sm text-gray-500">{title}</h2>
        {children}
      </div>
    </div>
  );
}
