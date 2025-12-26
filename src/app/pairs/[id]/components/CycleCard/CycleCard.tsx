import { BreedingCycle } from '@/types';
import { Trash2, Calendar, CheckCircle2, CircleDashed } from 'lucide-react';
import styles from './CycleCard.module.css';

interface CycleCardProps {
  cycle: BreedingCycle;
  onClick: () => void;
  onDelete: () => void;
}

export function CycleCard({ cycle, onClick, onDelete }: CycleCardProps) {
  const percentage = cycle.eggsCount > 0 ? (cycle.hatchedCount / cycle.eggsCount) * 100 : 0;
  const isComplete = cycle.status === 'CONCLUIDO';

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.dateBadge}>
          <Calendar size={12} />
          <span>{new Date(cycle.startDate).toLocaleDateString('pt-BR')}</span>
        </div>
        {isComplete ? (
          <span className={styles.doneBadge}><CheckCircle2 size={12} /> Concluído</span>
        ) : (
          <span className={styles.activeBadge}><CircleDashed size={12} /> Em Andamento</span>
        )}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.labels}>
          <span className={styles.label}>Progresso de Eclosão</span>
          <span className={styles.value}>{cycle.hatchedCount} / {cycle.eggsCount}</span>
        </div>
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${percentage}%`, backgroundColor: percentage > 50 ? '#34C759' : '#FF9500' }} 
          />
        </div>
      </div>

      {cycle.notes && (
        <div className={styles.notes}>
          <p>{cycle.notes}</p>
        </div>
      )}

      <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}