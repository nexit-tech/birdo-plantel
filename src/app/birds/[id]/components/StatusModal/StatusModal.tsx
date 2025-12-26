'use client';

import { BirdStatus } from '@/types';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import clsx from 'clsx';
import styles from './StatusModal.module.css';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: BirdStatus;
  onSelect: (status: BirdStatus) => void;
}

export function StatusModal({ isOpen, onClose, currentStatus, onSelect }: StatusModalProps) {
  const statuses: { value: BirdStatus; label: string; style: string }[] = [
    { value: 'DISPONIVEL', label: 'Disponível', style: styles.disponivel },
    { value: 'REPRODUCAO', label: 'Em Reprodução', style: styles.reproducao },
    { value: 'VENDIDO', label: 'Vendido', style: styles.vendido },
    { value: 'OBITO', label: 'Óbito', style: styles.obito },
  ];

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Status"
    >
      <div className={styles.list}>
        {statuses.map((status) => (
          <button
            key={status.value}
            className={clsx(styles.item, currentStatus === status.value && styles.activeItem)}
            onClick={() => { onSelect(status.value); onClose(); }}
          >
            <span className={clsx(styles.badge, status.style)}>{status.label}</span>
            {currentStatus === status.value && <span className={styles.check}>✓</span>}
          </button>
        ))}
      </div>
    </SheetModal>
  );
}