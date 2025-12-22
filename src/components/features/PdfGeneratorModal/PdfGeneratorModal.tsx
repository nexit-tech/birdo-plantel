'use client';

import { useState } from 'react';
import { X, Search, FileText, Download } from 'lucide-react';
import { MOCK_BIRDS, MOCK_BREEDER } from '@/data/mock';
import { Bird } from '@/types';
import { generatePedigreePDF } from '@/utils/pdfGenerator';
import styles from './PdfGeneratorModal.module.css';

interface PdfGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PdfGeneratorModal({ isOpen, onClose }: PdfGeneratorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  if (!isOpen) return null;

  const filtered = MOCK_BIRDS.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    if (selectedBird) {
      generatePedigreePDF(selectedBird, MOCK_BREEDER);
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
              <FileText size={48} className={styles.previewIcon} />
              <h4 className={styles.previewTitle}>Pronto para Gerar</h4>
              <p className={styles.previewSub}>
                Documento de identificação para <strong>{selectedBird.name}</strong>
              </p>
            </div>

            <button onClick={handleDownload} className={styles.downloadBtn}>
              <Download size={20} />
              Baixar PDF Oficial
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