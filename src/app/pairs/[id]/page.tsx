'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_PAIRS, MOCK_BIRDS } from '@/data/mock';
import { Header } from '@/components/layout/Header/Header';
import { CycleCard } from './components/CycleCard/CycleCard';
import { CycleModal } from './components/CycleModal/CycleModal';
import { PairStatusModal } from './components/PairStatusModal/PairStatusModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Heart, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { Pair, BreedingCycle, PairStatus } from '@/types';
import styles from './page.module.css';
import clsx from 'clsx';

export default function PairDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [pair, setPair] = useState<Pair | null>(null);
  
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<BreedingCycle | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    const found = MOCK_PAIRS.find((p) => p.id === unwrappedParams.id);
    if (found) setPair(found);
  }, [unwrappedParams.id]);

  if (!pair) return null;

  const male = MOCK_BIRDS.find(b => b.id === pair.maleId);
  const female = MOCK_BIRDS.find(b => b.id === pair.femaleId);

  const handleSaveCycle = (cycle: BreedingCycle) => {
    setPair(prev => {
      if (!prev) return null;
      const exists = prev.cycles.some(c => c.id === cycle.id);
      const newCycles = exists 
        ? prev.cycles.map(c => c.id === cycle.id ? cycle : c)
        : [cycle, ...prev.cycles];
      
      return { ...prev, cycles: newCycles };
    });
  };

  const handleEditCycle = (cycle: BreedingCycle) => {
    setEditingCycle(cycle);
    setIsCycleModalOpen(true);
  };

  const handleAddCycle = () => {
    setEditingCycle(null);
    setIsCycleModalOpen(true);
  };

  const handleStatusChange = (status: PairStatus) => {
    setPair(prev => prev ? ({ ...prev, status }) : null);
  };

  const handleDeletePair = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Desfazer Casal?',
      message: 'O histórico reprodutivo será mantido, mas o vínculo será desfeito.',
      onConfirm: () => {
        router.push('/pairs');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className={styles.container}>
      <Header 
        title={pair.name} 
        showBack 
        action={
          <div className={styles.actions}>
             <button className={styles.actionBtn} onClick={handleDeletePair}>
                <Trash2 size={22} color="var(--danger)" />
             </button>
             <button className={styles.actionBtn}>
                <Edit2 size={22} color="var(--primary)" />
             </button>
          </div>
        }
      />

      <div className={styles.scrollContent}>
        <div className={styles.heroCard}>
          <div className={styles.heroHeader}>
             <button className={styles.statusButton} onClick={() => setIsStatusModalOpen(true)}>
                <span className={clsx(styles.statusBadge, styles[pair.status.toLowerCase()])}>{pair.status.replace('_', ' ')}</span>
                <ChevronDown size={14} className={styles.statusArrow} />
             </button>
             <span className={styles.cageLabel}>{pair.cage}</span>
          </div>

          <div className={styles.birdsRow}>
            <Link href={`/birds/${male?.id}`} className={styles.birdLink}>
              <div className={clsx(styles.avatar, styles.maleAvatar)}>♂</div>
              <span className={styles.birdName}>{male?.name}</span>
              <span className={styles.birdRing}>{male?.ringNumber}</span>
            </Link>

            <div className={styles.connector}>
               <Heart size={24} className={styles.heartIcon} />
               <span className={styles.sinceDate}>Desde {new Date(pair.startDate).getFullYear()}</span>
            </div>

            <Link href={`/birds/${female?.id}`} className={styles.birdLink}>
              <div className={clsx(styles.avatar, styles.femaleAvatar)}>♀</div>
              <span className={styles.birdName}>{female?.name}</span>
              <span className={styles.birdRing}>{female?.ringNumber}</span>
            </Link>
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>HISTÓRICO DE POSTURAS</div>
          <button className={styles.addButton} onClick={handleAddCycle}>+ Nova Postura</button>
        </div>

        <div className={styles.cyclesList}>
          {pair.cycles && pair.cycles.length > 0 ? (
            pair.cycles.map(cycle => (
              <CycleCard 
                key={cycle.id} 
                cycle={cycle} 
                onClick={() => handleEditCycle(cycle)} 
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🥚</div>
              <p>Nenhuma postura registrada.</p>
              <button className={styles.emptyBtn} onClick={handleAddCycle}>Iniciar Reprodução</button>
            </div>
          )}
        </div>
      </div>

      <CycleModal 
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        initialData={editingCycle}
        onSave={handleSaveCycle}
      />

      <PairStatusModal 
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={pair.status}
        onSelect={handleStatusChange}
      />

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        confirmLabel="Desfazer"
        isDanger
      />
    </div>
  );
}