'use client';

import { useState } from 'react';
import { Bird } from '@/types';
import { Search } from 'lucide-react';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './BirdSelectorModal.module.css';

interface BirdSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (birdId: string) => void;
  candidates: Bird[];
  title: string;
}

export function BirdSelectorModal({ isOpen, onClose, onSelect, candidates, title }: BirdSelectorModalProps) {
  const [search, setSearch] = useState('');

  const filtered = candidates.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.ringNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            className={styles.input} 
            placeholder="Buscar ave..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.list}>
          {filtered.length > 0 ? filtered.map(bird => (
            <button key={bird.id} className={styles.item} onClick={() => {
              onSelect(bird.id);
              onClose();
            }}>
              <div className={styles.avatar}>{bird.gender === 'MACHO' ? '♂' : '♀'}</div>
              <div className={styles.info}>
                <span className={styles.itemName}>{bird.name}</span>
                <span className={styles.itemRing}>{bird.ringNumber}</span>
              </div>
              <span className={styles.itemBadge}>{bird.status}</span>
            </button>
          )) : (
            <div className={styles.empty}>Nenhuma ave encontrada</div>
          )}
        </div>
      </div>
    </SheetModal>
  );
}