'use client';

import { useState, Suspense } from 'react';
import { Header } from '@/components/layout/Header/Header';
import { PairCard } from './components/PairCard/PairCard';
import { NewPairModal } from './components/NewPairModal/NewPairModal';
import { usePairs } from '@/hooks/usePairs';
import { useBirds } from '@/hooks/useBirds';
import { Plus, Search, Filter } from 'lucide-react';
import { Pair } from '@/types';
import styles from './page.module.css';

function PairsListContent() {
  const { pairs, isLoading, createPair } = usePairs();
  const { birds } = useBirds();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSavePair = async (pairData: Omit<Pair, 'id' | 'cycles'>) => {
    await createPair(pairData);
    setIsModalOpen(false);
  };

  const filteredPairs = pairs.filter(pair => {
    const search = searchTerm.toLowerCase();
    return (
      pair.name?.toLowerCase().includes(search) ||
      pair.maleName?.toLowerCase().includes(search) ||
      pair.femaleName?.toLowerCase().includes(search)
    );
  });

  return (
    <div className={styles.container}>
      <Header 
        title="Plantel de Reprodução" 
        action={
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <Plus size={24} />
          </button>
        }
      />

      <div className={styles.heroSearch}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por casal ou anilha..."
            className={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.clearBtn} onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Carregando genética...</span>
            </div>
        ) : filteredPairs.length > 0 ? (
          <div className={styles.grid}>
            {filteredPairs.map((pair) => (
              <PairCard 
                key={pair.id} 
                pair={pair}
                male={birds.find(b => b.id === pair.maleId)}
                female={birds.find(b => b.id === pair.femaleId)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🧬</div>
            <h3>Nenhum casal encontrado</h3>
            <p>Toque no + para iniciar uma nova união.</p>
          </div>
        )}
      </div>

      <NewPairModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePair}
        availableMales={birds.filter(b => b.gender === 'MACHO')}
        availableFemales={birds.filter(b => b.gender === 'FEMEA')}
      />
    </div>
  );
}

export default function PairsList() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PairsListContent />
    </Suspense>
  );
}