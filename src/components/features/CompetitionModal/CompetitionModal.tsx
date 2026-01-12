'use client';

import { useState, useEffect } from 'react';
import { Search, Trophy, Loader2, Award, ChevronLeft } from 'lucide-react';
import { Bird } from '@/types';
import { generateCompetitionPDF } from '@/utils/pdf/competition/generateCompetitionPDF';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { useBirds, useProfile } from '@/hooks';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './CompetitionModal.module.css';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompetitionModal({ isOpen, onClose }: CompetitionModalProps) {
  const { birds } = useBirds();
  const { profile } = useProfile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/public/bird/${selectedBird?.id}` 
    : '';

  const filtered = birds.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async () => {
    if (selectedBird && profile) {
      setIsGenerating(true);
      try {
        const canvas = document.getElementById('qr-code-competition') as HTMLCanvasElement;
        const qrCodeDataUrl = canvas ? canvas.toDataURL('image/png') : undefined;

        await generateCompetitionPDF(selectedBird, profile, birds, qrCodeDataUrl);
        
      } catch (error) {
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
    >
      <div className={styles.container}>
        
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Trophy size={36} className={styles.trophyIcon} />
          </div>
          <h2 className={styles.title}>Modo Competição</h2>
          <p className={styles.subtitle}>Gerador de Fichas Oficiais</p>
        </div>

        {!selectedBird ? (
          <>
            <div className={styles.searchContainer}>
              <input 
                className={styles.input}
                placeholder="Buscar ave..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Search size={18} className={styles.searchIcon} />
            </div>

            <div className={styles.list}>
              {filtered.length > 0 ? (
                filtered.map(bird => (
                  <button 
                    key={bird.id} 
                    className={styles.birdItem}
                    onClick={() => setSelectedBird(bird)}
                  >
                    <div className={styles.birdInfo}>
                      <h4>{bird.name}</h4>
                      <span>{bird.ringNumber}</span>
                    </div>
                    <Award size={22} className={styles.awardIcon} />
                  </button>
                ))
              ) : (
                <div className={styles.empty}>
                  Nenhuma ave encontrada.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.previewContent}>
            
            <div className={styles.competitionCard}>
              <Trophy size={32} color="#fbbf24" style={{ marginBottom: 8 }} />
              <h3 className={styles.cardName}>{selectedBird.name}</h3>
              <span className={styles.cardRing}>{selectedBird.ringNumber}</span>
              
              <div className={styles.qrContainer}>
                <QRCodeCanvas 
                  id="qr-code-competition"
                  value={publicUrl}
                  size={140}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <span className={styles.qrLabel}>Escaneie para Perfil Público</span>
            </div>

            <div className={styles.actions}>
              <button 
                onClick={handleDownload} 
                className={styles.downloadBtn}
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 size={20} className={styles.spin} /> : <Award size={20} />}
                {isGenerating ? 'Processando...' : 'Baixar Ficha Oficial'}
              </button>

              <button 
                className={styles.backBtn}
                onClick={() => setSelectedBird(null)}
                disabled={isGenerating}
              >
                <ChevronLeft size={16} />
                Selecionar Outra Ave
              </button>
            </div>
          </div>
        )}
      </div>
    </SheetModal>
  );
}