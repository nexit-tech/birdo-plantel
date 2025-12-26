'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePair, useBirds } from '@/hooks';
import { Header } from '@/components/layout/Header/Header';
import { GenealogyCard } from './components/GenealogyCard/GenealogyCard';
import { CycleCard } from './components/CycleCard/CycleCard';
import { CycleModal } from './components/CycleModal/CycleModal';
import { PairStatusModal } from './components/PairStatusModal/PairStatusModal';
import { EditPairModal } from './components/EditPairModal/EditPairModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Trash2, Plus, Edit2, TrendingUp, Egg, Bird } from 'lucide-react';
import { BreedingCycle } from '@/types';
import styles from './page.module.css';

export default function PairDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { pair, loading, updatePair, updateStatus, addCycle, updateCycle, deleteCycle, deletePair } = usePair(id);
  const { birds } = useBirds();

  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<BreedingCycle | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  if (loading) return <div className={styles.loading}>Carregando dados...</div>;
  if (!pair) return <div className={styles.error}>Casal não encontrado</div>;

  const maleBird = birds.find(b => b.id === pair.maleId);
  const femaleBird = birds.find(b => b.id === pair.femaleId);

  // Cálculos de Performance
  const totalEggs = pair.cycles?.reduce((acc, c) => acc + (c.eggsCount || 0), 0) || 0;
  const totalHatched = pair.cycles?.reduce((acc, c) => acc + (c.hatchedCount || 0), 0) || 0;
  const hatchRate = totalEggs > 0 ? Math.round((totalHatched / totalEggs) * 100) : 0;

  const handleSaveCycle = async (cycleData: any) => {
    'id' in cycleData ? await updateCycle(cycleData) : await addCycle(cycleData);
    setIsCycleModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header 
        title={pair.name} 
        showBack 
        action={
          <div className={styles.headerActions}>
            <button className={styles.actionBtn} onClick={() => setIsEditModalOpen(true)}><Edit2 size={18} /></button>
            <button className={styles.deleteBtn} onClick={() => setConfirmConfig({
              isOpen: true, title: 'Dissolver Casal', message: 'Todo o histórico será perdido.', 
              onConfirm: async () => { await deletePair(); router.replace('/pairs'); }
            })}><Trash2 size={18} /></button>
          </div>
        }
      />

      <div className={styles.content}>
        {/* Hero Card de Status */}
        <div className={styles.heroCard}>
          <div className={styles.statusHeader} onClick={() => setIsStatusModalOpen(true)}>
             <div className={styles.statusIndicator}>
                <span className={`${styles.statusDot} ${styles[pair.status.toLowerCase()]}`} />
                <span className={styles.statusLabel}>{pair.status}</span>
             </div>
             <span className={styles.changeStatus}>Alterar</span>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statBox}>
              <div className={styles.iconCircle} style={{ background: '#E3F2FD', color: '#007AFF' }}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{hatchRate}%</span>
                <span className={styles.statTitle}>Eficiência</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <div className={styles.iconCircle} style={{ background: '#FFF3E0', color: '#FF9800' }}>
                <Egg size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalEggs}</span>
                <span className={styles.statTitle}>Ovos Totais</span>
              </div>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <div className={styles.iconCircle} style={{ background: '#E8F5E9', color: '#4CAF50' }}>
                <Bird size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{totalHatched}</span>
                <span className={styles.statTitle}>Nascidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reprodutores */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Genética do Casal</h3>
          <div className={styles.parentsGrid}>
            <Link href={`/birds/${pair.maleId}`} className={styles.parentLink}>
              <GenealogyCard role="PAI" bird={maleBird} readonly />
            </Link>
            <Link href={`/birds/${pair.femaleId}`} className={styles.parentLink}>
              <GenealogyCard role="MAE" bird={femaleBird} readonly />
            </Link>
          </div>
        </div>

        {/* Timeline de Ciclos */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Histórico Reprodutivo</h3>
            <button className={styles.addCycleBtn} onClick={() => { setEditingCycle(null); setIsCycleModalOpen(true); }}>
              <Plus size={16} /> Registrar Ciclo
            </button>
          </div>

          <div className={styles.cyclesContainer}>
            {pair.cycles && pair.cycles.length > 0 ? (
              pair.cycles.map(cycle => (
                <CycleCard 
                  key={cycle.id} 
                  cycle={cycle}
                  onClick={() => { setEditingCycle(cycle); setIsCycleModalOpen(true); }}
                  onDelete={() => setConfirmConfig({
                    isOpen: true, title: 'Excluir Ciclo', message: 'Confirmar exclusão?',
                    onConfirm: () => deleteCycle(cycle.id)
                  })}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <span>Nenhuma postura registrada ainda.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CycleModal isOpen={isCycleModalOpen} onClose={() => setIsCycleModalOpen(false)} onSave={handleSaveCycle} initialData={editingCycle} />
      <PairStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} currentStatus={pair.status} onSelect={(s) => { updateStatus(s); setIsStatusModalOpen(false); }} />
      <EditPairModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} pair={pair} onSave={(data) => updatePair(data)} />
      <ConfirmModal isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onConfirm} onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} isDanger />
    </div>
  );
}