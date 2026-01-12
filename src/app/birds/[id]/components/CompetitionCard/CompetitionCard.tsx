'use client';

import React from 'react';
import styles from './CompetitionCard.module.css';
import { Trash2, Calendar, MapPin, Trophy } from 'lucide-react';
import { formatDate } from '@/utils/date';
import clsx from 'clsx';
import { CompetitionResult } from '@/types';

interface CompetitionCardProps {
  results: CompetitionResult[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export function CompetitionCard({ results, isLoading, onDelete }: CompetitionCardProps) {

  const getPlaceClass = (place: number) => {
    if (place === 1) return styles.gold;
    if (place === 2) return styles.silver;
    if (place === 3) return styles.bronze;
    return styles.defaultPlace;
  };

  const totalTrophies = results.filter(r => r.place === 1).length;
  const bestPlace = results.length > 0 ? Math.min(...results.map(r => r.place)) : '-';

  if (isLoading) return <div className={styles.emptyState}>Carregando histórico...</div>;

  if (results.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Trophy size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
        <p>Nenhuma competição registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{results.length}</span>
          <span className={styles.summaryLabel}>Torneios</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{totalTrophies}</span>
          <span className={styles.summaryLabel}>Vitórias (1º)</span>
        </div>
         <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{bestPlace}º</span>
          <span className={styles.summaryLabel}>Melhor Col.</span>
        </div>
      </div>

      <div className={styles.list}>
        {results.map((result) => (
          <div key={result.id} className={styles.ticket}>
            <div className={clsx(styles.placeSection, getPlaceClass(result.place))}>
              <span className={styles.placeNumber}>{result.place}</span>
              <span className={styles.placeOrdinal}>Lugar</span>
            </div>

            <div className={styles.infoSection}>
              <span className={styles.tournament}>{result.tournament_name}</span>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <Calendar size={12} />
                  {formatDate(result.event_date)}
                </span>
                {result.city && (
                  <span className={styles.metaItem}>
                    <MapPin size={12} />
                    {result.city}
                  </span>
                )}
                {result.points && (
                  <span className={styles.pointsBadge}>{result.points} pts</span>
                )}
              </div>
            </div>

            <button 
              className={styles.deleteBtn}
              onClick={() => onDelete(result.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}