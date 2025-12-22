import Link from 'next/link';
import { Bird, Pair } from '@/types';
import { Heart, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './PairCard.module.css';

interface PairCardProps {
  pair: Pair;
  male?: Bird;
  female?: Bird;
}

export function PairCard({ pair, male, female }: PairCardProps) {
  return (
    <Link href={`/pairs/${pair.id}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.pairInfo}>
          <span className={styles.pairName}>{pair.name}</span>
          <span className={styles.cage}>{pair.cage}</span>
        </div>
        <div className={clsx(styles.statusBadge, styles[pair.status.toLowerCase()])}>
          {pair.status}
        </div>
      </div>

      <div className={styles.birdsContainer}>
        <div className={styles.birdSide}>
          <div className={clsx(styles.avatar, styles.maleAvatar)}>♂</div>
          <div className={styles.birdDetails}>
            <span className={styles.birdName}>{male?.name || 'Desconhecido'}</span>
            <span className={styles.birdRing}>{male?.ringNumber || '-'}</span>
          </div>
        </div>

        <div className={styles.connector}>
          <Heart size={16} className={styles.heartIcon} />
        </div>

        <div className={styles.birdSide}>
          <div className={clsx(styles.avatar, styles.femaleAvatar)}>♀</div>
          <div className={styles.birdDetails}>
            <span className={styles.birdName}>{female?.name || 'Desconhecida'}</span>
            <span className={styles.birdRing}>{female?.ringNumber || '-'}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.date}>Desde {new Date(pair.startDate).toLocaleDateString('pt-BR')}</span>
        <ChevronRight size={16} className={styles.arrow} />
      </div>
    </Link>
  );
}