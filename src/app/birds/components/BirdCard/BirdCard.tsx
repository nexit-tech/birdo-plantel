import Link from 'next/link';
import { Bird } from '@/types';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './BirdCard.module.css';

interface BirdCardProps {
  bird: Bird;
}

export function BirdCard({ bird }: BirdCardProps) {
  return (
    <Link href={`/birds/${bird.id}`} className={styles.card}>
      <div className={styles.avatar}>
        {bird.gender === 'MACHO' ? '♂' : bird.gender === 'FEMEA' ? '♀' : '?'}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.name}>{bird.name}</span>
            <span className={styles.ring}>{bird.ringNumber}</span>
          </div>
          <span className={clsx(styles.badge, styles[bird.status.toLowerCase()])}>
            {bird.status}
          </span>
        </div>
        <h3 className={styles.species}>{bird.species}</h3>
        <p className={styles.mutation}>{bird.mutation}</p>
      </div>

      <ChevronRight size={20} className={styles.arrow} />
    </Link>
  );
}