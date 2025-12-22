'use client';

import { useState } from 'react';
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

  if (!isOpen) return null;

  const filtered = birds.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    if (selectedBird && profile) {
      // Passamos 'birds' (lista completa) como 4º argumento
      generatePedigreePDF(selectedBird, profile, bgColor, birds);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>Gerar Documento SISPASS</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        {!selectedBird ? (
          <>
            <div className={styles.searchBox}>
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
              {filtered.map(bird => (
                <button 
                  key={bird.id} 
                  className={styles.item}
                  onClick={() => setSelectedBird(bird)}
                >
                  <div className={styles.iconWrapper}><FileText size={20} /></div>
                  <div className={styles.info}>
                    <span className={styles.name}>{bird.name}</span>
                    <span className={styles.ring}>{bird.ringNumber}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div 
                className={styles.fileIconBig}
                style={{ backgroundColor: bgColor }}
              >
                <FileText size={40} color="#1C1C1E" />
              </div>
              <h4 className={styles.previewTitle}>{selectedBird.name}</h4>
              <p className={styles.previewSub}>
                Anilha: {selectedBird.ringNumber}
              </p>
            </div>

            <div className={styles.optionsSection}>
              <ColorPicker 
                label="Cor do Fundo da Ficha"
                value={bgColor}
                onChange={setBgColor}
              />
            </div>

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
        )}
      </div>
    </div>
  );
}