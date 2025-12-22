'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_BIRDS } from '@/data/mock';
import { Header } from '@/components/layout/Header/Header';
import { InfoRow } from './components/InfoRow/InfoRow';
import { HistoryRow } from './components/HistoryRow/HistoryRow';
import { AddLogModal, LogData } from './components/AddLogModal/AddLogModal';
import { GenealogyCard } from './components/GenealogyCard/GenealogyCard';
import { BirdSelectorModal } from './components/BirdSelectorModal/BirdSelectorModal';
import { StatusModal } from './components/StatusModal/StatusModal';
import { WeightModal } from './components/WeightModal/WeightModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';
import { Bird, LogType, BirdLog, BirdStatus, BirdWeight } from '@/types';
import styles from './page.module.css';
import clsx from 'clsx';

export default function BirdDetails({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [bird, setBird] = useState<Bird | null>(null);
  
  // Logs States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeLogType, setActiveLogType] = useState<LogType>('SAUDE');
  const [editingLog, setEditingLog] = useState<BirdLog | null>(null);
  
  // Parent Selector States
  const [isParentSelectorOpen, setIsParentSelectorOpen] = useState(false);
  const [parentSelectorType, setParentSelectorType] = useState<'PAI' | 'MAE'>('PAI');
  
  // Status State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Weight States (Atualizado)
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [editingWeight, setEditingWeight] = useState<BirdWeight | null>(null);

  // Confirm Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    const found = MOCK_BIRDS.find((b) => b.id === unwrappedParams.id);
    if (found) setBird(found);
  }, [unwrappedParams.id]);

  if (!bird) return null;

  // --- HELPERS ---
  const requestConfirm = (title: string, message: string, action: () => void) => {
    setConfirmConfig({
      isOpen: true, title, message,
      onConfirm: () => { action(); setConfirmConfig(prev => ({ ...prev, isOpen: false })); }
    });
  };

  // --- HANDLERS GERAIS ---
  const handleStatusChange = (newStatus: BirdStatus) => {
    setBird(prev => prev ? ({ ...prev, status: newStatus }) : null);
  };

  // --- HANDLERS LOGS ---
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
    requestConfirm('Excluir Registro?', 'Essa ação não poderá ser desfeita.', () => {
      setBird(prev => prev ? ({ ...prev, logs: prev.logs.filter(l => l.id !== logId) }) : null);
    });
  };

  const handleSaveLog = (data: LogData) => {
    setBird((prev) => {
      if (!prev) return null;
      const newLogs = [...(prev.logs || [])];
      
      const newLogEntry: BirdLog = {
        id: data.id || Math.random().toString(),
        type: activeLogType,
        title: data.title,
        date: data.date,
        notes: data.notes || undefined,
        icon: data.icon
      };

      if (data.id) {
        const index = newLogs.findIndex(l => l.id === data.id);
        if (index !== -1) newLogs[index] = newLogEntry;
      } else {
        newLogs.unshift(newLogEntry);
      }
      return { ...prev, logs: newLogs };
    });
  };

  // --- HANDLERS PESO / BIOMETRIA (Atualizado) ---
  const handleAddWeight = () => {
    setEditingWeight(null);
    setIsWeightModalOpen(true);
  };

  const handleEditWeight = (weight: BirdWeight) => {
    setEditingWeight(weight);
    setIsWeightModalOpen(true);
  };

  const handleSaveWeight = (data: BirdWeight) => {
    setBird(prev => {
      if (!prev) return null;
      let newWeights = [...(prev.weights || [])];
      
      // Verifica se é edição (ID já existe) ou criação
      const index = newWeights.findIndex(w => w.id === data.id);
      
      if (index !== -1) {
        // Atualiza existente
        newWeights[index] = data;
      } else {
        // Adiciona novo no início (ou fim, e depois ordena)
        newWeights = [data, ...newWeights];
      }
      
      return { ...prev, weights: newWeights };
    });
  };

  const handleDeleteWeight = (id: string) => {
    requestConfirm('Excluir Biometria?', 'Deseja remover este registro?', () => {
      setBird(prev => prev ? ({ ...prev, weights: prev.weights.filter(w => w.id !== id) }) : null);
    });
  };

  // --- HANDLERS GENEALOGIA ---
  const openParentSelector = (type: 'PAI' | 'MAE') => {
    setParentSelectorType(type);
    setIsParentSelectorOpen(true);
  };

  const handleSelectParent = (selectedId: string) => {
    setBird((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        fatherId: parentSelectorType === 'PAI' ? selectedId : prev.fatherId,
        motherId: parentSelectorType === 'MAE' ? selectedId : prev.motherId
      };
    });
  };

  const handleDeleteParent = (type: 'PAI' | 'MAE') => {
    const label = type === 'PAI' ? 'Pai' : 'Mãe';
    requestConfirm(`Remover ${label}?`, `Deseja desvincular o registro?`, () => {
      setBird((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          fatherId: type === 'PAI' ? undefined : prev.fatherId,
          motherId: type === 'MAE' ? undefined : prev.motherId
        };
      });
    });
  };

  const handleDeleteBird = () => {
    requestConfirm('Excluir Ave?', 'A ave e todo seu histórico serão removidos permanentemente.', () => {
      alert('Ave excluída com sucesso (Simulação)');
      router.push('/birds');
    });
  };

  // --- DADOS COMPUTADOS ---
  const father = MOCK_BIRDS.find(b => b.id === bird.fatherId);
  const mother = MOCK_BIRDS.find(b => b.id === bird.motherId);
  
  const getCandidates = () => {
    const genderNeeded = parentSelectorType === 'PAI' ? 'MACHO' : 'FEMEA';
    return MOCK_BIRDS.filter(b => b.id !== bird.id && b.gender === genderNeeded);
  };

  const healthLogs = bird.logs?.filter(l => l.type === 'SAUDE') || [];
  const reproLogs = bird.logs?.filter(l => l.type === 'REPRODUCAO') || [];
  const foodLogs = bird.logs?.filter(l => l.type === 'ALIMENTACAO') || [];
  const weightsList = [...(bird.weights || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={handleDeleteBird}>
              <Trash2 size={22} color="var(--danger)" />
            </button>
            <button className={styles.actionBtn}><Edit2 size={22} color="var(--primary)" /></button>
          </div>
        }
      />

      <div className={styles.scrollContent}>
        {/* Hero e Info Básica */}
        <div className={styles.hero}>
          <div className={styles.avatarLarge}>
            {bird.gender === 'MACHO' ? '♂' : bird.gender === 'FEMEA' ? '♀' : '?'}
          </div>
          <h2 className={styles.heroTitle}>{bird.name}</h2>
          <p className={styles.heroSubtitle}>{bird.ringNumber}</p>
          <span className={styles.heroSpecies}>{bird.species} - {bird.mutation}</span>
        </div>

        <div className={styles.sectionTitle}>INFORMAÇÕES BÁSICAS</div>
        <div className={styles.group}>
          <InfoRow label="Nome" value={bird.name} />
          <InfoRow label="Anilha" value={bird.ringNumber} />
          <InfoRow label="Nascimento" value={bird.birthDate} />
          <InfoRow label="Gênero" value={bird.gender} />
          <div className={styles.clickableRow} onClick={() => setIsStatusModalOpen(true)}>
            <InfoRow label="Status" value={<StatusValue />} isLast />
          </div>
        </div>

        <div className={styles.sectionTitle}>GENEALOGIA</div>
        <div className={styles.genealogyGrid}>
          <GenealogyCard 
            role="PAI" bird={father} 
            onAdd={() => openParentSelector('PAI')} 
            onEdit={() => openParentSelector('PAI')}
            onDelete={() => handleDeleteParent('PAI')}
          />
          <GenealogyCard 
            role="MAE" bird={mother} 
            onAdd={() => openParentSelector('MAE')} 
            onEdit={() => openParentSelector('MAE')}
            onDelete={() => handleDeleteParent('MAE')}
          />
        </div>

        {/* REGISTRO DE SAÚDE */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>REGISTRO DE SAÚDE</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('SAUDE')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {healthLogs.length > 0 ? healthLogs.map((log, index) => (
            <HistoryRow 
              key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')}
              subtitle={log.notes} isLast={index === healthLogs.length - 1}
              onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)}
            />
          )) : <div className={styles.emptyState}>Nenhum registro de saúde</div>}
        </div>

        {/* PESO E CRESCIMENTO (Com Edição Ativada) */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>PESO E CRESCIMENTO</div>
          <button className={styles.addButton} onClick={handleAddWeight}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {weightsList.length > 0 ? weightsList.map((w, index) => (
            <HistoryRow 
              key={w.id} 
              icon="⚖️" 
              title="Biometria" 
              date={new Date(w.date).toLocaleDateString('pt-BR')}
              subtitle={`Peso: ${w.weight}g${w.height ? ` • Tamanho: ${w.height}cm` : ''}`} 
              isLast={index === weightsList.length - 1}
              onEdit={() => handleEditWeight(w)} 
              onDelete={() => handleDeleteWeight(w.id)}
            />
          )) : <div className={styles.emptyState}>Nenhum registro biométrico</div>}
        </div>

        {/* REPRODUÇÃO */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>REPRODUÇÃO</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('REPRODUCAO')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {reproLogs.length > 0 ? reproLogs.map((log, index) => (
            <HistoryRow 
              key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')}
              subtitle={log.notes} isLast={index === reproLogs.length - 1}
              onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)}
            />
          )) : <div className={styles.emptyState}>Nenhum registro reprodutivo</div>}
        </div>

        {/* ALIMENTAÇÃO */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>ALIMENTAÇÃO</div>
          <button className={styles.addButton} onClick={() => handleOpenAddLog('ALIMENTACAO')}>+ Adicionar</button>
        </div>
        <div className={styles.group}>
          {foodLogs.length > 0 ? foodLogs.map((log, index) => (
            <HistoryRow 
              key={log.id} icon={log.icon} title={log.title} date={new Date(log.date).toLocaleDateString('pt-BR')}
              subtitle={log.notes} isLast={index === foodLogs.length - 1}
              onEdit={() => handleEditLog(log)} onDelete={() => handleDeleteLog(log.id)}
            />
          )) : <div className={styles.emptyState}>Nenhum registro de alimentação</div>}
        </div>
      </div>

      {/* Modais */}
      <AddLogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        type={activeLogType} 
        initialData={editingLog ? { ...editingLog, notes: editingLog.notes || null } : null} 
        onSave={handleSaveLog} 
      />
      <BirdSelectorModal 
        isOpen={isParentSelectorOpen} 
        onClose={() => setIsParentSelectorOpen(false)} 
        title={parentSelectorType === 'PAI' ? 'Selecionar Pai' : 'Selecionar Mãe'} 
        candidates={getCandidates()} 
        onSelect={handleSelectParent} 
      />
      <StatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        currentStatus={bird.status} 
        onSelect={handleStatusChange} 
      />
      <WeightModal 
        isOpen={isWeightModalOpen} 
        onClose={() => setIsWeightModalOpen(false)} 
        initialData={editingWeight} // Passando dados de edição
        onSave={handleSaveWeight} 
      />
      
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        confirmLabel="Confirmar"
        isDanger={true}
      />
    </div>
  );
}