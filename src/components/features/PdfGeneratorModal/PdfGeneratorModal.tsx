'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, FileText, Download } from 'lucide-react';
import { Bird } from '@/types';
import { generatePedigreePDF } from '@/utils/pdfGenerator';
import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
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

  useEffect(() => {
    setMounted(true);
    // Bloqueia o scroll do corpo da página quando o modal abre
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const filtered = birds.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    if (selectedBird && profile) {
      generatePedigreePDF(selectedBird, profile, bgColor, birds);
    }
  };

  // O createPortal renderiza o modal diretamente no document.body
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {selectedBird ? 'Configurar Ficha' : 'Gerar Documento SISPASS'}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.body}>
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
                <button onClick={handleDownload} className={styles.downloadBtn}>
                  <Download size={20} />
                  Baixar Ficha PDF
                </button>

                <button 
                  className={styles.backBtn}
                  onClick={() => setSelectedBird(null)}
                >
                  Selecionar Outra Ave
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}