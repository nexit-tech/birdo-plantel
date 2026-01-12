'use client';

import React, { useState, useEffect } from 'react';
import styles from './ShareModal.module.css';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { ShareSettings } from '@/types';
import { 
  Globe, 
  Lock, 
  Copy, 
  Check, 
  Link as LinkIcon,
  Dna, 
  Trophy, 
  Activity, 
  Egg
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPublic: boolean;
  shareSettings?: ShareSettings;
  onTogglePrivacy: (status: boolean) => Promise<boolean | void>;
  onUpdateSettings: (settings: ShareSettings) => Promise<boolean | void>;
  birdId: string;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  isPublic, 
  shareSettings, 
  onTogglePrivacy,
  onUpdateSettings,
  birdId
}: ShareModalProps) {
  
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState<ShareSettings>({
    showGenealogy: true,
    showCompetitions: true,
    showHealth: false,
    showReproduction: false,
    showPhotos: true
  });

  const publicLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/share/${birdId}`
    : '';

  useEffect(() => {
    if (shareSettings) {
      setLocalSettings(shareSettings);
    }
  }, [shareSettings]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePrivacy = async () => {
    setLoading(true);
    await onTogglePrivacy(!isPublic);
    setLoading(false);
  };

  const handleToggleSetting = async (key: keyof ShareSettings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    await onUpdateSettings(newSettings);
  };

  return (
    <SheetModal isOpen={isOpen} onClose={onClose} title="Compartilhar Ficha">
      <div className={styles.container}>
        
        <div className={`${styles.statusCard} ${isPublic ? styles.active : ''}`}>
          <div className={styles.statusIcon}>
            {isPublic ? <Globe size={28} /> : <Lock size={28} />}
          </div>
          <div>
            <h3 className={styles.statusTitle}>
              {isPublic ? 'Visualização Pública Ativa' : 'Ficha Privada'}
            </h3>
            <p className={styles.statusDesc}>
              {isPublic 
                ? 'A ficha desta ave pode ser acessada por qualquer pessoa com o link.' 
                : 'Apenas você tem acesso aos dados desta ave.'}
            </p>
          </div>
        </div>

        {isPublic && (
          <div className={styles.linkSection}>
            <div className={styles.linkInputWrapper}>
              <LinkIcon size={16} className={styles.linkIcon} />
              <input 
                readOnly 
                value={publicLink} 
                className={styles.linkInput}
                onClick={(e) => e.currentTarget.select()} 
              />
            </div>
            <button onClick={handleCopy} className={styles.copyButton}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        )}

        <div className={styles.settingsSection}>
          <span className={styles.sectionTitle}>Dados Visíveis</span>
          
          <div className={styles.toggleList}>
            
            <div className={`${styles.toggleItem} ${!isPublic ? styles.disabled : ''}`}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleIconBox}>
                  <Dna size={18} />
                </div>
                <span className={styles.toggleLabel}>Genealogia</span>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={localSettings.showGenealogy}
                  onChange={() => handleToggleSetting('showGenealogy')}
                  disabled={!isPublic}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={`${styles.toggleItem} ${!isPublic ? styles.disabled : ''}`}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleIconBox}>
                  <Trophy size={18} />
                </div>
                <span className={styles.toggleLabel}>Competições</span>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={localSettings.showCompetitions}
                  onChange={() => handleToggleSetting('showCompetitions')}
                  disabled={!isPublic}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={`${styles.toggleItem} ${!isPublic ? styles.disabled : ''}`}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleIconBox}>
                  <Activity size={18} />
                </div>
                <span className={styles.toggleLabel}>Histórico de Saúde</span>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={localSettings.showHealth}
                  onChange={() => handleToggleSetting('showHealth')}
                  disabled={!isPublic}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={`${styles.toggleItem} ${!isPublic ? styles.disabled : ''}`}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleIconBox}>
                  <Egg size={18} />
                </div>
                <span className={styles.toggleLabel}>Reprodução</span>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={localSettings.showReproduction}
                  onChange={() => handleToggleSetting('showReproduction')}
                  disabled={!isPublic}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

          </div>
        </div>

        <button 
          className={`${styles.mainAction} ${isPublic ? styles.btnPrivate : styles.btnPublic}`}
          onClick={handleTogglePrivacy}
          disabled={loading}
        >
          {loading ? 'Processando...' : (isPublic ? 'Desativar Link Público' : 'Gerar Link Público')}
        </button>

      </div>
    </SheetModal>
  );
}