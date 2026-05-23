'use client';

import { useEffect, useState } from 'react';

type ToastItem = { id: string; message: string; type?: 'success' | 'error' | 'info' };

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent)?.detail || {};
      const id = crypto.randomUUID();
      const item: ToastItem = { id, message: d.message || '', type: d.type || 'info' };

      setToasts((t) => {
        // keep max 3
        const next = [item, ...t].slice(0, 3);
        return next;
      });

      // auto remove
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, d.duration || 3000);
    };

    window.addEventListener('showToast', handler as EventListener);
    return () => window.removeEventListener('showToast', handler as EventListener);
  }, []);

  const remove = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center sm:items-end sm:justify-end p-4">
      <div className="w-full max-w-sm space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 bg-white/95 dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-200 transition transform "` +
              `translate-y-0 opacity-100` +
              `"`}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500 text-white">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : 'i'}
            </div>
            <div className="text-sm text-gray-900">{t.message}</div>
            <div className="ml-auto">
              <button
                onClick={() => remove(t.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
