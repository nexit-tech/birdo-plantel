import Image from 'next/image';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <div className={styles.spinnerRing} />
        <div className={styles.logo}>
          <img 
            src="/birdo.png" 
            alt="Birdo Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
      <span className={styles.text}>Carregando...</span>
    </div>
  );
}