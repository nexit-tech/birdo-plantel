import { BottomNav } from '../BottomNav/BottomNav';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}