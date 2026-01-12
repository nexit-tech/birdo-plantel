'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Trophy, Calendar, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { Bird } from '@/types';
import { useBirds } from '@/hooks/useBirds';
import { useProfile } from '@/hooks/useProfile';
import { generateCompetitionPDF } from '@/utils/pdf/competition/generateCompetitionPDF';
import styles from './CompetitionModal.module.css';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  birds?: Bird[];
}

export function CompetitionModal({ isOpen, onClose, birds: propBirds }: CompetitionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedBirds, setSelectedBirds] = useState<string[]>([]);
  const [tournamentName, setTournamentName] = useState('');
  const [association, setAssociation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Hooks de dados
  const { birds: hookBirds, isLoading: isLoadingBirds } = useBirds();
  const { profile, isLoading: isLoadingProfile } = useProfile();

  // Define a fonte de dados (prioriza props, fallback para hook)
  const birdsSource = (Array.isArray(propBirds) && propBirds.length > 0) 
    ? propBirds 
    : (hookBirds || []);

  const isLoading = (isLoadingBirds && birdsSource.length === 0) || isLoadingProfile;

  // Garante renderização apenas no cliente (Portal)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Bloqueia scroll do fundo e preenche dados iniciais
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Se tiver perfil carregado e o campo estiver vazio, sugere o nome
      if (profile?.name && !association) {
        // setAssociation(profile.name); // Descomente se quiser autopreencher
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, profile, association]);

  // Filtra aves válidas para exibição
  const availableBirds = birdsSource.filter(b => 
    b && 
    b.status !== 'OBITO' && 
    b.status !== 'VENDIDO'
  );

  const toggleBird = (id: string) => {
    setSelectedBirds(prev => 
      prev.includes(id) 
        ? prev.filter(birdId => birdId !== id)
        : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedBirds.length === availableBirds.length) {
      setSelectedBirds([]);
    } else {
      setSelectedBirds(availableBirds.map(b => b.id));
    }
  };

  const handleGenerate = async () => {
    if (selectedBirds.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      // 1. Recupera objetos completos das aves selecionadas
      const birdsToPrint = birdsSource.filter(b => selectedBirds.includes(b.id));
      
      // 2. Garante o plantel completo para a árvore genealógica
      const fullPlantel = hookBirds && hookBirds.length > 0 ? hookBirds : birdsSource;

      // 3. Chama o gerador de PDF
      await generateCompetitionPDF(
        birdsToPrint, 
        fullPlantel,
        profile || null, 
        {
          tournamentName: tournamentName || 'Torneio',
          association: association,
          date: new Date().toLocaleDateString('pt-BR')
        }
      );

      // Sucesso: pode fechar o modal ou apenas avisar
      // onClose(); 

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao criar o arquivo PDF. Tente novamente ou verifique se as aves possuem todos os dados.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Cabeçalho Premium: Preto e Dourado */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Trophy size={20} className={styles.iconPrimary} fill="currentColor" />
            <h2>Ficha de Competição</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Inputs do Evento */}
          <div className={styles.section}>
            <div className={styles.inputGroup}>
              <label htmlFor="tournament">Nome do Torneio / Evento</label>
              <input 
                id="tournament"
                type="text" 
                placeholder="Ex: Campeonato Nacional 2025"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                autoFocus
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="association">Associação / Clube</label>
              <input 
                id="association"
                type="text" 
                placeholder={profile?.name ? `Ex: ${profile.name}` : "Nome da associação"}
                value={association}
                onChange={(e) => setAssociation(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Lista de Seleção */}
          <div className={styles.birdListSection}>
            <div className={styles.birdListHeader}>
              <div className={styles.listTitle}>
                <h3>Selecionar Aves</h3>
                {!isLoading && <span className={styles.badge}>{selectedBirds.length}</span>}
              </div>
              {!isLoading && availableBirds.length > 0 && (
                <button 
                  type="button" 
                  className={styles.selectAllBtn}
                  onClick={toggleAll}
                >
                  {selectedBirds.length === availableBirds.length ? 'Desmarcar' : 'Selecionar todas'}
                </button>
              )}
            </div>

            <div className={styles.birdList}>
              {isLoading ? (
                <div className={styles.emptyState}>
                  <Loader2 className="animate-spin" size={24} color="var(--gold-primary)" />
                  <p style={{ marginTop: 8 }}>Carregando plantel...</p>
                </div>
              ) : availableBirds.length === 0 ? (
                <div className={styles.emptyState}>
                  <AlertCircle size={24} color="var(--text-tertiary)" />
                  <p>Nenhuma ave disponível para competição.</p>
                </div>
              ) : (
                availableBirds.map(bird => {
                  const isSelected = selectedBirds.includes(bird.id);
                  return (
                    <div 
                      key={bird.id} 
                      className={clsx(styles.birdItem, isSelected && styles.selected)}
                      onClick={() => toggleBird(bird.id)}
                    >
                      <div className={clsx(styles.checkbox, isSelected && styles.checked)}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div className={styles.birdInfo}>
                        <span className={styles.birdName}>{bird.name || 'Sem Nome'}</span>
                        <div className={styles.birdMeta}>
                          <span className={styles.birdRing}>{bird.ringNumber}</span>
                          <span className={styles.separator}>•</span>
                          <span>{bird.species}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Rodapé com Ação */}
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
          <div className={styles.actions}>
            <button 
              onClick={onClose} 
              className={styles.cancelBtn}
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button 
              onClick={handleGenerate} 
              className={styles.confirmBtn}
              disabled={selectedBirds.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Fichas PDF'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}