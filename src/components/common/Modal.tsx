import React, { useEffect } from 'react';
import { cn } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  title,
  subtitle,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <button
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={cn(
          'glass-strong relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 safe-bottom sm:pb-6 sm:pt-6 animate-slide-up',
          'max-h-[90vh] overflow-y-auto',
          className,
        )}
      >
        {(title || subtitle) && (
          <header className="mb-4">
            {title && (
              <h2 className="text-xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-secondary">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
