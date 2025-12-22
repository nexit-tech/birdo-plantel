import styles from './InfoRow.module.css';

interface InfoRowProps {
  label: string;
  value?: string | React.ReactNode;
  isLast?: boolean;
}

export function InfoRow({ label, value, isLast }: InfoRowProps) {
  return (
    <div className={styles.row} style={{ borderBottom: isLast ? 'none' : '' }}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || '-'}</span>
    </div>
  );
}