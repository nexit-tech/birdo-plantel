import { Bird } from '@/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './GenealogyCard.module.css';

interface GenealogyCardProps {
  role: 'PAI' | 'MAE';
  bird?: Bird | undefined;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  readonly?: boolean;
}

export function GenealogyCard({ role, bird, onAdd, onEdit, onDelete, readonly }: GenealogyCardProps) {
  const isMale = role === 'PAI';
  const placeholder = isMale ? 'Adicionar Pai' : 'Adicionar Mãe';
  const icon = isMale ? '♂' : '♀';

  if (!bird) {
    if (readonly) return null;
    return (
      <button className={styles.emptyCard} onClick={onAdd}>
        <div className={styles.iconPlaceholder}>{icon}</div>
        <span className={styles.addText}>{placeholder}</span>
        <Plus size={20} className={styles.plusIcon} />
      </button>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.role}>{role}</span>
        {!readonly && (
          <div className={styles.actions}>
            {onEdit && <button onClick={onEdit}><Edit2 size={16} /></button>}
            {onDelete && <button onClick={onDelete} className={styles.delete}><Trash2 size={16} /></button>}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.avatar}>{icon}</div>
        <div className={styles.info}>
          <div className={styles.name}>{bird.name}</div>
          <div className={styles.ring}>{bird.ringNumber}</div>
        </div>
      </div>
    </div>
  );
}