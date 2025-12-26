'use client';

import { useState, useEffect } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { Breeder } from '@/types';
import { uploadImage } from '@/utils/storage';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Breeder | null;
  onSave: (data: Breeder) => void;
}

export function EditProfileModal({ isOpen, onClose, initialData, onSave }: EditProfileModalProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Breeder>({
    id: '',
    name: '',
    email: '',
    registryNumber: '',
    phone: '',
    city: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file, 'profile');
    
    if (url) {
      setFormData(prev => ({ ...prev, photoUrl: url }));
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Editar Perfil</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageUploadSection}>
            <div className={styles.imageWrapper}>
              {formData.photoUrl ? (
                <img 
                  src={formData.photoUrl} 
                  alt="Logo do Criatório" 
                  className={styles.imagePreview} 
                />
              ) : (
                <div className={styles.placeholder}>
                  <Camera size={32} className={styles.cameraIcon} />
                </div>
              )}
              
              {uploading && (
                <div className={styles.uploadingOverlay}>
                  <Loader2 className={styles.spinner} size={24} />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
                id="profile-photo-upload"
              />
              <label htmlFor="profile-photo-upload" className={styles.uploadLabel}>
                {formData.photoUrl ? 'Alterar Logo' : 'Adicionar Logo'}
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nome do Criatório / Criador</label>
            <input
              className={styles.input}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Ex: Criadouro Silva"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Registro (IBAMA/FOB)</label>
            <input
              className={styles.input}
              value={formData.registryNumber}
              onChange={e => setFormData({...formData, registryNumber: e.target.value})}
              placeholder="Ex: 123456"
            />
          </div>

          <div className={styles.row}>
             <div className={styles.field}>
                <label className={styles.label}>Telefone</label>
                <input
                  className={styles.input}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                />
             </div>
             <div className={styles.field}>
                <label className={styles.label}>Cidade/UF</label>
                <input
                  className={styles.input}
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  placeholder="Ex: São Paulo - SP"
                />
             </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}