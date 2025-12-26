'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Download, Loader2 } from 'lucide-react';
import { Bird } from '@/types';
import { generatePedigreePDF } from '@/utils/pdfGenerator';
import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { useBirds, useProfile } from '@/hooks';
import styles from './PdfGeneratorModal.module.css';

interface PdfGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PdfGeneratorModal({ isOpen, onClose }: PdfGeneratorModalProps) {
  const { birds } = useBirds();
  const { profile } = useProfile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = birds.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async () => {
    if (selectedBird && profile) {
      setIsGenerating(true);
      try {
        await generatePedigreePDF(selectedBird, profile, bgColor, birds);
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
      title={selectedBird ? 'Configurar Ficha' : 'Gerar Documento'}
    >
      {!selectedBird ? (
        <>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              className={styles.input}
              placeholder="Buscar ave..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
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
                  <FileText size={20} color="#64748b" />
                </button>
              ))
            ) : (
              <div className={styles.empty}>
                Nenhuma ave encontrada com esse termo.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.previewContent}>
          <div className={styles.previewCard} style={{ backgroundColor: bgColor }}>
             <div className={styles.previewIcon}>
                <FileText size={24} color="#000" />
             </div>
             <div className={styles.previewInfo}>
                <h4 style={{ color: '#000' }}>{selectedBird.name}</h4>
                <p style={{ color: '#4b5563' }}>Anilha: {selectedBird.ringNumber}</p>
             </div>
          </div>

          <ColorPicker 
            label="Cor de Fundo da Ficha"
            value={bgColor}
            onChange={setBgColor}
          />

          <div className={styles.actions}>
            <button 
              onClick={handleDownload} 
              className={styles.downloadBtn}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 size={20} className={styles.spin} /> : <Download size={20} />}
              {isGenerating ? 'Gerando...' : 'Baixar Ficha PDF'}
            </button>

            <button 
              className={styles.backBtn}
              onClick={() => setSelectedBird(null)}
              disabled={isGenerating}
            >
              Selecionar Outra Ave
            </button>
          </div>
        </div>
      )}
    </SheetModal>
  );
}