'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  useLogo?: boolean;
}

export function Header({ title, showBack, action, useLogo }: HeaderProps) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>
        )}
        
        {useLogo ? (
          <div className={styles.brand}>
            <div className={styles.logoWrapper}>
              <Image 
                src="/birdo.png" 
                alt="Birdo Logo" 
                width={32} 
                height={32} 
                className={styles.logo}
                priority
              />
            </div>
            <span className={styles.brandName}>Birdo</span>
          </div>
        ) : (
          <h1 className={styles.title}>{title}</h1>
        )}
      </div>
      
      {action && <div className={styles.right}>{action}</div>}
    </header>
  );
}