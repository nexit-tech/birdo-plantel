import Link from 'next/link';
import { Bird as BirdIcon, ChevronRight } from 'lucide-react';
import { Bird } from '@/types';
import styles from './BirdCard.module.css';
import clsx from 'clsx';

interface BirdCardProps {
  bird: Bird;
}

export function BirdCard({ bird }: BirdCardProps) {
  return (
    <Link href={`/birds/${bird.id}`} className={styles.card}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          {bird.photoUrl ? (
            <img 
              src={bird.photoUrl} 
              alt={bird.name} 
              className={styles.birdImage} 
            />
          ) : (
            <BirdIcon size={24} />
          )}
        </div>
        
        <div className={styles.info}>
          <div className={styles.header}>
            <span className={styles.name}>{bird.name}</span>
            <span className={clsx(styles.gender, {
              [styles.male]: bird.gender === 'MACHO',
              [styles.female]: bird.gender === 'FEMEA'
            })}>
              {bird.gender === 'MACHO' ? '♂' : bird.gender === 'FEMEA' ? '♀' : '?'}
            </span>
          </div>
          <span className={styles.ring}>{bird.ringNumber}</span>
          <span className={styles.species}>{bird.species}</span>
        </div>
      </div>
      
      <div className={styles.status}>
        <span className={clsx(styles.badge, {
          [styles.available]: bird.status === 'DISPONIVEL',
          [styles.reproduction]: bird.status === 'REPRODUCAO',
          [styles.sold]: bird.status === 'VENDIDO',
          [styles.dead]: bird.status === 'OBITO'
        })}>
          {bird.status === 'DISPONIVEL' && 'Disponível'}
          {bird.status === 'REPRODUCAO' && 'Reprodução'}
          {bird.status === 'VENDIDO' && 'Vendido'}
          {bird.status === 'OBITO' && 'Óbito'}
        </span>
        <ChevronRight size={20} className={styles.arrow} />
      </div>
    </Link>
  );
}