import { BreedingCycle } from '@/types';
import { Egg, Bird, Calendar, ChevronRight } from 'lucide-react';
import styles from './CycleCard.module.css';
import clsx from 'clsx';

interface CycleCardProps {
  cycle: BreedingCycle;
  onClick: () => void;
}

export function CycleCard({ cycle, onClick }: CycleCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.dateInfo}>
          <Calendar size={14} className={styles.icon} />
          <span className={styles.date}>
            {new Date(cycle.startDate).toLocaleDateString('pt-BR')}
            {cycle.endDate ? ` - ${new Date(cycle.endDate).toLocaleDateString('pt-BR')}` : ' (Atual)'}
          </span>
        </div>
        <span className={clsx(styles.badge, cycle.status === 'EM_ANDAMENTO' ? styles.active : styles.done)}>
          {cycle.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Concluído'}
        </span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}>
            <Egg size={20} color="#FF9500" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{cycle.eggsCount}</span>
            <span className={styles.statLabel}>Ovos</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stat}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
            <Bird size={20} color="#34C759" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{cycle.hatchedCount}</span>
            <span className={styles.statLabel}>Eclodiram</span>
          </div>
        </div>
      </div>

      {cycle.notes && <p className={styles.notes}>{cycle.notes}</p>}
      
      <div className={styles.arrowLayer}>
        <ChevronRight size={16} color="#C7C7CC" />
      </div>
    </div>
  );
}