'use client';

import { useState, useEffect } from 'react';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { createClient } from '@/lib/supabase/client';
import { Copy, Check, Share2, Trophy, Dna, Image as ImageIcon } from 'lucide-react';
import styles from './ShareModal.module.css';
import clsx from 'clsx';
import { ShareSettings } from '@/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  birdId: string;
  initialIsPublic?: boolean;
  initialSettings?: ShareSettings;
  birdName: string;
}

export function ShareModal({ 
  isOpen, 
  onClose, 
  birdId, 
  initialIsPublic = false,
  initialSettings 
}: ShareModalProps) {
  const supabase = createClient();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [settings, setSettings] = useState<ShareSettings>(initialSettings || {
    showGenealogy: true,
    showCompetitions: true,
    showHealth: false,
    showReproduction: false,
    showPhotos: true
  });
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/share/${birdId}`);
    }
  }, [birdId]);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen, birdId]);

  const fetchStatus = async () => {
    const { data, error } = await supabase
      .from('birds')
      .select('is_public, share_settings')
      .eq('id', birdId)
      .single();

    if (data && !error) {
      setIsPublic(data.is_public);
      if (data.share_settings) {
        setSettings(data.share_settings as ShareSettings);
      }
    }
  };

  const handleTogglePublic = async (newValue: boolean) => {
    setIsPublic(newValue);
    await supabase
      .from('birds')
      .update({ is_public: newValue })
      .eq('id', birdId);
  };

  const handleToggleSetting = async (key: keyof ShareSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    await supabase
      .from('birds')
      .update({ share_settings: newSettings })
      .eq('id', birdId);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Compartilhar Ave"
    >
      <div className={styles.container}>
        
        <div className={styles.mainToggle}>
          <div className={styles.toggleInfo}>
            <div className={styles.iconBg}>
              <Share2 size={24} color="#007AFF" />
            </div>
            <div className={styles.toggleText}>
              <span className={styles.toggleLabel}>Acesso Público</span>
              <span className={styles.toggleDesc}>
                {isPublic ? 'Link ativo e visível para todos' : 'Ninguém pode visualizar esta ave'}
              </span>
            </div>
          </div>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isPublic}
              onChange={(e) => handleTogglePublic(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={clsx(styles.linkWrapper, !isPublic && styles.disabledLink)}>
          <div className={styles.urlBox}>
            <span className={styles.urlText}>{shareUrl}</span>
          </div>
          <button 
            className={clsx(styles.copyButton, copied && styles.copied)} 
            onClick={isPublic ? copyToClipboard : undefined}
            disabled={!isPublic}
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.settingsSection}>
          <h3 className={styles.sectionTitle}>Visibilidade dos Dados</h3>
          
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <Dna size={20} className={styles.settingIcon} />
              <span>Genealogia</span>
            </div>
            <label className={styles.checkbox}>
              <input 
                type="checkbox" 
                checked={settings.showGenealogy}
                onChange={() => handleToggleSetting('showGenealogy')}
              />
              <span className={styles.checkMark}></span>
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <Trophy size={20} className={styles.settingIcon} />
              <span>Competições</span>
            </div>
            <label className={styles.checkbox}>
              <input 
                type="checkbox" 
                checked={settings.showCompetitions}
                onChange={() => handleToggleSetting('showCompetitions')}
              />
              <span className={styles.checkMark}></span>
            </label>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <ImageIcon size={20} className={styles.settingIcon} />
              <span>Fotos</span>
            </div>
            <label className={styles.checkbox}>
              <input 
                type="checkbox" 
                checked={settings.showPhotos !== false}
                onChange={() => handleToggleSetting('showPhotos')}
              />
              <span className={styles.checkMark}></span>
            </label>
          </div>

        </div>

      </div>
    </SheetModal>
  );
}