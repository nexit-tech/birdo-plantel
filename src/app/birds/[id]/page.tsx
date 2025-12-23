'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBird, useBirds } from '@/hooks';
import { Header } from '@/components/layout/Header/Header';
import { InfoRow } from './components/InfoRow/InfoRow';
import { GenealogyCard } from './components/GenealogyCard/GenealogyCard';
import { AddLogModal, LogData } from './components/AddLogModal/AddLogModal';
import { BirdSelectorModal } from './components/BirdSelectorModal/BirdSelectorModal';
import { StatusModal } from './components/StatusModal/StatusModal';
import { WeightModal } from './components/WeightModal/WeightModal';
import { HistoryRow } from './components/HistoryRow/HistoryRow';
import { AddBirdModal } from '../components/AddBirdModal/AddBirdModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';
import { BirdLog, LogType, BirdStatus, BirdWeight, Bird } from '@/types';
import styles from './page.module.css';
import clsx from 'clsx';

export default function BirdDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { 
    bird, 
    loading, 
    updateStatus, 
    addLog, 
    updateLog, 
    deleteLog, 
    saveWeight, 
    deleteWeight,
    updateParent 
  } = useBird(id);

  const { birds: allBirds, updateBird, deleteBird } = useBirds();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeLogType, setActiveLogType] = useState<LogType>('SAUDE');
  const [editingLog, setEditingLog] = useState<BirdLog | null>(null);
  
  const [isParentSelectorOpen, setIsParentSelectorOpen] = useState(false);
  const [parentSelectorType, setParentSelectorType] = useState<'PAI' | 'MAE'>('PAI');
  
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [editingWeight, setEditingWeight] = useState<BirdWeight | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!bird) return <div className={styles.error}>Ave não encontrada</div>;

  const requestConfirm = (title: string, message: string, action: () => void) => {
    setConfirmConfig({
      isOpen: true, title, message,
      onConfirm: () => { action(); setConfirmConfig(prev => ({ ...prev, isOpen: false })); }
    });
  };

  const handleEditBird = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBird = async (updatedBird: Bird) => {
    if (updateBird) {
      await updateBird(updatedBird);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBird = () => {
    requestConfirm('Excluir Ave?', 'A ave e todo seu histórico serão removidos permanentemente.', async () => {
      if (deleteBird) {
        await deleteBird(bird.id);
        router.replace('/birds');
      }
    });
  };

  const handleStatusChange = async (newStatus: BirdStatus) => {
    await updateStatus(newStatus);
    setIsStatusModalOpen(false);
  };

  const handleOpenAddLog = (type: LogType) => {
    setActiveLogType(type);
    setEditingLog(null);
    setIsLogModalOpen(true);
  };

  const handleEditLog = (log: BirdLog) => {
    setActiveLogType(log.type);
    setEditingLog(log);
    setIsLogModalOpen(true);
  };

  const handleDeleteLog = (logId: string) => {
    requestConfirm('Excluir Registro?', 'Essa ação não poderá ser desfeita.', () => deleteLog(logId));
  };

  const handleSaveLog = async (data: LogData) => {
    const logPayload = { type: activeLogType, title: data.title, date: data.date, notes: data.notes || undefined, icon: data.icon };
    if (data.id) await updateLog({ ...logPayload, id: data.id });
    else await addLog(logPayload);
    setIsLogModalOpen(false);
  };

  const handleAddWeight = () => { setEditingWeight(null); setIsWeightModalOpen(true); };
  const handleEditWeight = (w: BirdWeight) => { setEditingWeight(w); setIsWeightModalOpen(true); };
  const handleSaveWeight = async (data: BirdWeight) => { await saveWeight(data); setIsWeightModalOpen(false); };
  const handleDeleteWeight = (id: string) => { requestConfirm('Excluir?', 'Remover peso?', () => deleteWeight(id)); };

  const openParentSelector = (type: 'PAI' | 'MAE') => { setParentSelectorType(type); setIsParentSelectorOpen(true); };
  const handleSelectParent = async (sid: string) => { await updateParent(parentSelectorType, sid); setIsParentSelectorOpen(false); };
  const handleDeleteParent = (type: 'PAI' | 'MAE') => { requestConfirm('Remover?', 'Desvincular?', () => updateParent(type, undefined)); };

  const father = allBirds.find(b => b.id === bird.fatherId);
  const mother = allBirds.find(b => b.id === bird.motherId);
  
  const getCandidates = () => {
    const genderNeeded = parentSelectorType === 'PAI' ? 'MACHO' : 'FEMEA';
    return allBirds.filter(b => b.id !== bird.id && b.gender === genderNeeded);
  };

  const healthLogs = bird.logs?.filter(l => l.type === 'SAUDE') || [];
  const reproLogs = bird.logs?.filter(l => l.type === 'REPRODUCAO') || [];
  const foodLogs = bird.logs?.filter(l => l.type === 'ALIMENTACAO') || [];
  const weightsList = bird.weights || [];

  const StatusValue = () => (
    <div className={styles.statusValueWrapper}>
      <span className={clsx(styles.statusBadge, styles[bird.status.toLowerCase()])}>
        {bird.status}
      </span>
      <ChevronRight size={16} color="#C7C7CC" />
    </div>
  );

  return (
    <div className={styles.container}>
      <Header 
        title={bird.name} 
        showBack 
        action={
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={handleDeleteBird}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={22} color="#FF3B30" />
            </button>
            <button 
              onClick={handleEditBird}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Edit2 size={22} color="#007AFF" />
            </button>
          </div>
        }
      />

      <div className={styles.scrollContent}>
        <div className={styles.hero}>
          <div className={styles.avatarLarge}>
            {bird.photoUrl ? (
              <img 
                src={bird.photoUrl} 
                alt={bird.name} 
                className={styles.avatarImage} 
              />
            ) : (
              bird.gender === 'MACHO' ? '♂' : bird.gender === 'FEMEA' ? '♀' : '?'
            )}
          </div>
          <h2 className={styles.heroTitle}>{bird.name}</h2>
          <p className={styles.heroSubtitle}>{bird.ringNumber}</p>
          <span className={styles.heroSpecies}>{bird.species} - {bird.mutation}</span>
        </div>

        <div className={styles.sectionTitle}>INFORMAÇÕES BÁSICAS</div>
        <div className={styles.group}>
          <InfoRow label="Nome" value={bird.name} />
          <InfoRow label="Anilha" value={bird.ringNumber} />
          <InfoRow label="Nascimento" value={new Date(bird.birthDate).toLocaleDateString('pt-BR')} />
          <InfoRow label="Gênero" value={bird.gender} />
          <div className={styles.clickableRow} onClick={() => setIsStatusModalOpen(true)}>
            <InfoRow label="Status" value={<StatusValue />} isLast />
          </div>
        </div>

        <div className={styles.sectionTitle}>GENEALOGIA</div>
        <div className={styles.genealogyGrid}>
          <GenealogyCard role="PAI" bird={father} onAdd={() => openParentSelector('PAI')} onEdit={() => openParentSelector('PAI')} onDelete={() => handleDeleteParent('PAI')} />
          <GenealogyCard role="MAE" bird={mother} onAdd={() => openParentSelector('MAE')} onEdit={() => openParentSelector('MAE')} onDelete={() => handleDeleteParent('MAE')} />
        </div>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>REGISTRO DE SAÚDE</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('SAUDE')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {healthLogs.length > 0 ? healthLogs.map((log, index) => (
            <HistoryRow key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')} subtitle={log.notes} isLast={index === healthLogs.length - 1} onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)} />
          )) : <div className={styles.emptyState}>Nenhum registro de saúde</div>}
        </div>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>PESO E CRESCIMENTO</div>
          <button className={styles.addButton} onClick={handleAddWeight}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {weightsList.length > 0 ? weightsList.map((w, index) => (
            <HistoryRow key={w.id} icon="⚖️" title="Biometria" date={new Date(w.date).toLocaleDateString('pt-BR')} subtitle={`Peso: ${w.weight}g`} isLast={index === weightsList.length - 1} onEdit={() => handleEditWeight(w)} onDelete={() => handleDeleteWeight(w.id)} />
          )) : <div className={styles.emptyState}>Nenhum registro biométrico</div>}
        </div>

         <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>REPRODUÇÃO</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('REPRODUCAO')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {reproLogs.length > 0 ? reproLogs.map((log, index) => (
            <HistoryRow key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')} subtitle={log.notes} isLast={index === reproLogs.length - 1} onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)} />
          )) : <div className={styles.emptyState}>Nenhum registro reprodutivo</div>}
        </div>

        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>ALIMENTAÇÃO</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('ALIMENTACAO')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {foodLogs.length > 0 ? foodLogs.map((log, index) => (
            <HistoryRow key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')} subtitle={log.notes} isLast={index === foodLogs.length - 1} onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)} />
          )) : <div className={styles.emptyState}>Nenhum registro de alimentação</div>}
        </div>
      </div>

      <AddLogModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} type={activeLogType} initialData={editingLog ? { ...editingLog, notes: editingLog.notes || null } : null} onSave={handleSaveLog} />
      <BirdSelectorModal isOpen={isParentSelectorOpen} onClose={() => setIsParentSelectorOpen(false)} title={parentSelectorType === 'PAI' ? 'Selecionar Pai' : 'Selecionar Mãe'} candidates={getCandidates()} onSelect={handleSelectParent} />
      <StatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} currentStatus={bird.status} onSelect={handleStatusChange} />
      <WeightModal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} initialData={editingWeight} onSave={handleSaveWeight} />
      
      <AddBirdModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveBird} initialData={bird} />

      <ConfirmModal isOpen={confirmConfig.isOpen} title={confirmConfig.title} message={confirmConfig.message} onConfirm={confirmConfig.onConfirm} onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} confirmLabel="Confirmar" isDanger={true} />
    </div>
  );
}