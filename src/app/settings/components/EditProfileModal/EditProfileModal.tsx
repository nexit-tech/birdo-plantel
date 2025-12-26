'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks';
import { Breeder } from '@/types';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { profile, updateProfile, isLoading } = useProfile();
  const [formData, setFormData] = useState<Breeder | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Breeder, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
    >
      <div className={styles.content}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
             {formData.photoUrl ? (
               <img src={formData.photoUrl} alt="Avatar" />
             ) : (
               <span>{formData.name.charAt(0).toUpperCase()}</span>
             )}
          </div>
          <button className={styles.editPhotoBtn}>Alterar Foto</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <label className={styles.label}>Nome do Criatório / Criador</label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            
            <div className={styles.inputRow}>
              <label className={styles.label}>Cidade</label>
              <input
                type="text"
                className={styles.input}
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Sua cidade"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <label className={styles.label}>Registro (CTF/IBAMA)</label>
              <input
                type="text"
                className={styles.input}
                value={formData.registryNumber}
                onChange={(e) => handleChange('registryNumber', e.target.value)}
                placeholder="000000"
              />
            </div>

            <div className={styles.inputRow}>
              <label className={styles.label}>Telefone</label>
              <input
                type="tel"
                className={styles.input}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className={styles.inputRow}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="seu@email.com"
                readOnly 
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSaving || isLoading} 
            className={styles.saveBtn}
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </SheetModal>
  );
}