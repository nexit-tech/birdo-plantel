import { User, Plus, Trash2, Edit2 } from 'lucide-react';
import { Bird } from '@/types';
import clsx from 'clsx';
import styles from './GenealogyCard.module.css';

interface GenealogyCardProps {
  role: 'PAI' | 'MAE';
  bird?: Bird;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GenealogyCard({ role, bird, onAdd, onEdit, onDelete }: GenealogyCardProps) {
  const isMale = role === 'PAI';
  
  if (!bird) {
    return (
      <button className={styles.emptyCard} onClick={onAdd}>
        <div className={clsx(styles.iconCircle, isMale ? styles.male : styles.female)}>
          <Plus size={20} />
        </div>
        <span className={styles.emptyLabel}>Adicionar {role === 'PAI' ? 'Pai' : 'Mãe'}</span>
      </button>
    );
  }

  return (
    <div className={styles.filledCard}>
      <div className={styles.actionLayer}>
         <button onClick={onEdit} className={styles.tinyAction}><Edit2 size={14} /></button>
         <button onClick={onDelete} className={clsx(styles.tinyAction, styles.danger)}><Trash2 size={14} /></button>
      </div>

      <div className={styles.filledHeader}>
        <span className={styles.roleLabel}>{role === 'PAI' ? 'Pai' : 'Mãe'}</span>
        <div className={clsx(styles.genderIcon, isMale ? styles.textMale : styles.textFemale)}>
          {isMale ? '♂' : '♀'}
        </div>
      </div>
      <div className={styles.birdInfo}>
        <div className={styles.avatar}>
          <User size={16} />
        </div>
        <div className={styles.texts}>
          <span className={styles.name}>{bird.name}</span>
          <span className={styles.ring}>{bird.ringNumber}</span>
        </div>
      </div>
      <span className={styles.species}>{bird.mutation}</span>
    </div>
  );
}