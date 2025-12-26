'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import styles from './SheetModal.module.css';

interface SheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function SheetModal({ isOpen, onClose, title, children }: SheetModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Redireciona para o topo para garantir visibilidade
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Trava o scroll e adiciona classe para esconder navbar
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button onClick={onClose} className={styles.closeBtn} type="button">
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}