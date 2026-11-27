'use client';

import { useEffect, useState } from 'react';

type ToastItem = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent)?.detail || {};

      const id = crypto.randomUUID();

      const item: ToastItem = {
        id,
        message: d.message || '',
        type: d.type || 'info',
      };

      setToasts((t) => {
        return [item, ...t].slice(0, 3);
      });

      setTimeout(() => {
        setToasts((t) =>
          t.filter((x) => x.id !== id)
        );
      }, d.duration || 3000);
    };

    window.addEventListener(
      'showToast',
      handler as EventListener
    );

    return () =>
      window.removeEventListener(
        'showToast',
        handler as EventListener
      );
  }, []);

  const remove = (id: string) => {
    setToasts((t) =>
      t.filter((x) => x.id !== id)
    );
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex items-end justify-center sm:justify-end p-4">

      <div className="w-full max-w-sm space-y-3">

        {toasts.map((t) => (
          <div
            key={t.id}
            className="
              pointer-events-auto
              flex
              items-center
              gap-3
              rounded-md
              bg-white
              border
              border-gray-200
              shadow-lg
              px-4
              py-3
              animate-in
              slide-in-from-bottom-3
              fade-in
              duration-300
            "
          >
            {/* ICON */}
            <div
              className={`
                flex-shrink-0
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                text-white
                font-bold
                ${
                  t.type === 'success'
                    ? 'bg-emerald-500'
                    : t.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-sky-500'
                }
              `}
            >
              {t.type === 'success'
                ? '✓'
                : t.type === 'error'
                ? '!'
                : 'i'}
            </div>

            {/* MESSAGE */}
            <div className="flex-1 text-sm font-medium text-gray-800">
              {t.message}
            </div>

            {/* CLOSE */}
            <button
              onClick={() => remove(t.id)}
              className="
                text-gray-400
                hover:text-gray-700
                transition-colors
                text-lg
                leading-none
              "
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}