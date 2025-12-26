import Link from 'next/link';
import { Bird, Pair } from '@/types';
import { ChevronRight, Activity } from 'lucide-react';
import clsx from 'clsx';
import styles from './PairCard.module.css';

interface PairCardProps {
  pair: Pair;
  male?: Bird;
  female?: Bird;
}

export function PairCard({ pair, male, female }: PairCardProps) {
  const activeCycles = pair.cycles?.filter(c => c.status === 'EM_ANDAMENTO').length || 0;
  const totalCycles = pair.cycles?.length || 0;

  return (
    <Link href={`/pairs/${pair.id}`} className={styles.card}>
      <div className={styles.statusLine}>
        <span className={clsx(styles.statusDot, styles[pair.status.toLowerCase()])} />
        <span className={styles.statusText}>{pair.status}</span>
        {activeCycles > 0 && (
          <span className={styles.activeBadge}>
            <Activity size={12} /> Em Reprodução
          </span>
        )}
      </div>

      <div className={styles.birdsContainer}>
        <div className={styles.birdInfo}>
          <div className={clsx(styles.avatar, styles.maleAvatar)}>♂</div>
          <div className={styles.birdText}>
            <span className={styles.birdName}>{male?.name || 'Macho'}</span>
            <span className={styles.ring}>{male?.ringNumber || 'S/A'}</span>
          </div>
        </div>

        <div className={styles.connector}>
          <div className={styles.line} />
          <div className={styles.heart}>♥</div>
        </div>

        <div className={styles.birdInfo}>
          <div className={styles.birdTextRight}>
            <span className={styles.birdName}>{female?.name || 'Fêmea'}</span>
            <span className={styles.ring}>{female?.ringNumber || 'S/A'}</span>
          </div>
          <div className={clsx(styles.avatar, styles.femaleAvatar)}>♀</div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.pairName}>{pair.name}</span>
          <span className={styles.cage}>Gaiola {pair.cage}</span>
        </div>
        <div className={styles.stats}>
          <span>{totalCycles} Ciclos</span>
          <ChevronRight size={18} className={styles.arrow} />
        </div>
      </div>
    </Link>
  );
}