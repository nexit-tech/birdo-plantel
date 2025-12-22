import { ChevronRight } from 'lucide-react';
import styles from './SettingsRow.module.css';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  isDanger?: boolean;
}

export function SettingsRow({ icon, label, value, onClick, isDanger }: SettingsRowProps) {
  return (
    <button className={styles.row} onClick={onClick}>
      <div className={styles.left}>
        <div className={styles.iconBox}>{icon}</div>
        <span className={isDanger ? styles.dangerLabel : styles.label}>{label}</span>
      </div>
      <div className={styles.right}>
        {value && <span className={styles.value}>{value}</span>}
        <ChevronRight size={16} className={styles.arrow} />
      </div>
    </button>
  );
}