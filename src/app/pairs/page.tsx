'use client';

import { useState, Suspense } from 'react';
import { Header } from '@/components/layout/Header/Header';
import { PairCard } from './components/PairCard/PairCard';
import { NewPairModal } from './components/NewPairModal/NewPairModal';
import { usePairs } from '@/hooks/usePairs';
import { useBirds } from '@/hooks/useBirds';
import { Plus, Search } from 'lucide-react';
import { Pair } from '@/types';
import styles from './page.module.css';

function PairsListContent() {
  const { pairs, isLoading, createPair } = usePairs();
  const { birds } = useBirds();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSavePair = async (pairData: Pair) => {
    const { id, cycles, ...data } = pairData;
    await createPair(data);
    setIsModalOpen(false);
  };

  const filteredPairs = pairs.filter(pair => {
    const search = searchTerm.toLowerCase();
    return (
      pair.name?.toLowerCase().includes(search) ||
      pair.maleId?.toLowerCase().includes(search) ||
      pair.femaleId?.toLowerCase().includes(search)
    );
  });

  return (
    <div className={styles.container}>
      <Header 
        title="Meus Casais" 
        action={
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <Plus size={24} />
          </button>
        }
      />

      <div className={styles.searchWrapper}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome ou identificação..."
            className={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.list}>
        {isLoading && pairs.length === 0 ? (
            <div className={styles.empty}>Carregando casais...</div>
        ) : (
          <>
            {filteredPairs.map((pair) => (
              <PairCard key={pair.id} pair={pair} />
            ))}
            {filteredPairs.length === 0 && pairs.length > 0 && (
              <div className={styles.empty}>Nenhum resultado para a busca</div>
            )}
            {pairs.length === 0 && !isLoading && (
              <div className={styles.empty}>
                Nenhum casal formado
              </div>
            )}
          </>
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