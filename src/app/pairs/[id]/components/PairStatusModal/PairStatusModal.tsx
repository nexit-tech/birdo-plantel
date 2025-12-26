'use client';

import { PairStatus } from '@/types';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import clsx from 'clsx';
import styles from './PairStatusModal.module.css';

interface PairStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: PairStatus;
  onSelect: (status: PairStatus) => void;
}

export function PairStatusModal({ isOpen, onClose, currentStatus, onSelect }: PairStatusModalProps) {
  const statuses: { value: PairStatus; label: string; style: string }[] = [
    { value: 'ATIVO', label: 'Ativo', style: styles.ativo },
    { value: 'INCUBACAO', label: 'Incubação', style: styles.incubacao },
    { value: 'ALIMENTANDO', label: 'Alimentando Filhotes', style: styles.alimentando },
    { value: 'DESCANSO', label: 'Descanso / Separado', style: styles.descanso },
  ];

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Status do Casal"
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