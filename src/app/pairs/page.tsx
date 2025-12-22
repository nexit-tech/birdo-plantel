'use client';

import { useState, Suspense } from 'react';
import { Header } from '@/components/layout/Header/Header';
import { PairCard } from './components/PairCard/PairCard';
import { NewPairModal } from './components/NewPairModal/NewPairModal';
import { usePairs, useBirds } from '@/hooks';
import { Plus } from 'lucide-react';
import { Pair } from '@/types';
import styles from './page.module.css';

function PairsListContent() {
  const { pairs, isLoading, createPair } = usePairs();
  const { birds } = useBirds();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSavePair = async (pairData: Pair) => {
    const { id, cycles, ...data } = pairData;
    await createPair(data);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header 
        title="Casais" 
        action={
          <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
            <Plus size={24} />
          </button>
        }
      />

      <div className={styles.list}>
        {isLoading && pairs.length === 0 ? (
           <div className={styles.empty}>Carregando casais...</div>
        ) : (
          <>
            {pairs.map((pair) => (
              <PairCard key={pair.id} pair={pair} />
            ))}
            {pairs.length === 0 && (
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