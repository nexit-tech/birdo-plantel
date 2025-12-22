'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePair, useBirds } from '@/hooks';
import { Header } from '@/components/layout/Header/Header';
import { InfoRow } from './components/InfoRow/InfoRow';
import { GenealogyCard } from './components/GenealogyCard/GenealogyCard';
import { CycleCard } from './components/CycleCard/CycleCard';
import { CycleModal } from './components/CycleModal/CycleModal';
import { PairStatusModal } from './components/PairStatusModal/PairStatusModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Trash2, Plus, ChevronRight } from 'lucide-react';
import { BreedingCycle, PairStatus } from '@/types';
import styles from './page.module.css';
import clsx from 'clsx';

export default function PairDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { 
    pair, 
    loading, 
    updateStatus, 
    addCycle, 
    updateCycle, 
    deleteCycle, 
    deletePair 
  } = usePair(id);

  const { birds } = useBirds();

  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<BreedingCycle | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!pair) return <div className={styles.error}>Casal não encontrado</div>;

  const maleBird = birds.find(b => b.id === pair.maleId);
  const femaleBird = birds.find(b => b.id === pair.femaleId);

  const handleSaveCycle = async (cycle: BreedingCycle) => {
    if (editingCycle) {
      await updateCycle(cycle);
    } else {
      await addCycle(cycle);
    }
    setIsCycleModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header 
        title={pair.name} 
        showBack 
        action={
          <button className={styles.deleteBtn} onClick={() => {
            setConfirmConfig({
              isOpen: true,
              title: 'Excluir Casal',
              message: 'Confirma a exclusão?',
              onConfirm: async () => {
                await deletePair();
                router.replace('/pairs');
              }
            });
          }}>
            <Trash2 size={20} />
          </button>
        }
      />

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.statusRow} onClick={() => setIsStatusModalOpen(true)}>
             <span className={styles.label}>Status</span>
             <div className={styles.statusBadge}>
                <span className={clsx(styles.badge, styles[pair.status.toLowerCase()])}>{pair.status}</span>
                <ChevronRight size={16} />
             </div>
          </div>
          <InfoRow label="Gaiola" value={pair.cage} />
          <InfoRow label="Início" value={new Date(pair.startDate).toLocaleDateString('pt-BR')} isLast />
        </div>

        <div className={styles.sectionTitle}>AVES</div>
        <div className={styles.birdsGrid}>
          <GenealogyCard role="PAI" bird={maleBird} readonly />
          <GenealogyCard role="MAE" bird={femaleBird} readonly />
        </div>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>CICLOS</div>
          <button className={styles.addBtn} onClick={() => { setEditingCycle(null); setIsCycleModalOpen(true); }}>
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.cyclesList}>
          {pair.cycles?.map(cycle => (
            <CycleCard 
              key={cycle.id} 
              cycle={cycle}
              onClick={() => { setEditingCycle(cycle); setIsCycleModalOpen(true); }}
              onDelete={(e) => {
                e.stopPropagation();
                setConfirmConfig({
                  isOpen: true, title: 'Excluir Ciclo', message: 'Confirma?',
                  onConfirm: () => deleteCycle(cycle.id)
                });
              }}
            />
          ))}
        </div>
      </div>

      <CycleModal 
        isOpen={isCycleModalOpen} 
        onClose={() => setIsCycleModalOpen(false)} 
        onSave={handleSaveCycle}
        initialData={editingCycle}
      />

      <PairStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={pair.status}
        onSelect={(s) => { updateStatus(s); setIsStatusModalOpen(false); }}
      />
      
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        isDanger
      />
    </div>
  );
}