'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { BirdCard } from './components/BirdCard/BirdCard';
import { AddBirdModal } from './components/AddBirdModal/AddBirdModal';
import { MOCK_BIRDS } from '@/data/mock';
import { Search, Plus } from 'lucide-react';
import { Bird } from '@/types';
import styles from './page.module.css';

function BirdsListContent() {
  const [birds, setBirds] = useState<Bird[]>(MOCK_BIRDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      router.replace('/birds', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSaveBird = (newBird: Bird) => {
    setBirds([newBird, ...birds]);
  };

  const filteredBirds = birds.filter(bird => 
    bird.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bird.ringNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bird.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Header 
        title="Meus Pássaros" 
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
            placeholder="Buscar por nome, anilha..." 
            className={styles.input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.list}>
        {filteredBirds.map((bird) => (
          <BirdCard key={bird.id} bird={bird} />
        ))}
        {filteredBirds.length === 0 && (
          <div className={styles.empty}>
            Nenhuma ave encontrada
          </div>
        )}
      </div>

      <AddBirdModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBird}
      />
    </div>
  );
}

export default function BirdsList() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BirdsListContent />
    </Suspense>
  );
}