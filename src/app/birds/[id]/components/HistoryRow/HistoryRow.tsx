import { ReactNode } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './HistoryRow.module.css';

interface HistoryRowProps {
  date: string;
  title: string;
  subtitle?: string;
  icon: ReactNode; // Correção: Aceita string (emoji) ou Elemento React
  isLast?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function HistoryRow({ date, title, subtitle, icon, isLast, onEdit, onDelete }: HistoryRowProps) {
  return (
    <div className={styles.row} style={{ borderBottom: isLast ? 'none' : '' }}>
      <div className={styles.left}>
        <div className={styles.iconBox}>
          {/* Se for string (emoji), aumenta a fonte. Se for ícone, renderiza normal */}
          {typeof icon === 'string' ? <span style={{ fontSize: '20px' }}>{icon}</span> : icon}
        </div>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      
      <div className={styles.right}>
        <span className={styles.date}>{date}</span>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit2 size={16} />
          </button>
          <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}