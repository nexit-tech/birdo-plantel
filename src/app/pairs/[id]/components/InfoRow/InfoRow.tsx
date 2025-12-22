import styles from './InfoRow.module.css';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

export function InfoRow({ label, value, isLast = false }: InfoRowProps) {
  return (
    <div className={`${styles.row} ${isLast ? styles.last : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || '-'}</span>
    </div>
  );
}