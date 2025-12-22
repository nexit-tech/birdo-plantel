'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { PairCard } from './components/PairCard/PairCard';
import { NewPairModal } from './components/NewPairModal/NewPairModal';
import { MOCK_PAIRS, MOCK_BIRDS } from '@/data/mock';
import { Plus } from 'lucide-react';
import { Pair } from '@/types';
import styles from './page.module.css';

function PairsListContent() {
  const [pairs, setPairs] = useState<Pair[]>(MOCK_PAIRS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      router.replace('/pairs', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSavePair = (newPair: Pair) => {
    setPairs([newPair, ...pairs]);
  };

  const getBird = (id: string) => MOCK_BIRDS.find(b => b.id === id);

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

      <div className={styles.list}>
        {pairs.map((pair) => (
          <PairCard 
            key={pair.id} 
            pair={pair} 
            male={getBird(pair.maleId)}
            female={getBird(pair.femaleId)}
          />
        ))}
        {pairs.length === 0 && (
          <div className={styles.empty}>Nenhum casal formado</div>
        )}
      </div>

      <NewPairModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePair}
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