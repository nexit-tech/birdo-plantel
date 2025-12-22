import { BreedingCycle } from '@/types';
import { Trash2 } from 'lucide-react';
import styles from './CycleCard.module.css';

interface CycleCardProps {
  cycle: BreedingCycle;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function CycleCard({ cycle, onClick, onDelete }: CycleCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.date}>
          {new Date(cycle.startDate).toLocaleDateString('pt-BR')}
        </span>
        <span className={`${styles.status} ${styles[cycle.status === 'CONCLUIDO' ? 'closed' : 'active']}`}>
          {cycle.status === 'CONCLUIDO' ? 'Concluído' : 'Em Andamento'}
        </span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.value}>{cycle.eggsCount}</span>
          <span className={styles.label}>Ovos</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{cycle.hatchedCount}</span>
          <span className={styles.label}>Filhotes</span>
        </div>
      </div>
      {cycle.notes && <p className={styles.notes}>{cycle.notes}</p>}
      
      <button className={styles.deleteBtn} onClick={onDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}