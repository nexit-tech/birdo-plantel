'use client';

import { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Bird, Gender, BirdStatus } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Combobox } from '@/components/ui/Combobox/Combobox';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal'; // Importando o componente global
import { uploadImage } from '@/utils/storage';
import styles from './AddBirdModal.module.css';

interface AddBirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bird: Bird) => Promise<void> | void;
  initialData?: Bird;
}

export function AddBirdModal({ isOpen, onClose, onSave, initialData }: AddBirdModalProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ringNumber: '',
    species: '',
    mutation: '',
    gender: 'INDETERMINADO' as Gender,
    birthDate: '',
    status: 'DISPONIVEL' as BirdStatus,
    cage: '',
    initialWeight: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        ringNumber: initialData.ringNumber || '',
        species: initialData.species || '',
        mutation: initialData.mutation || '',
        gender: initialData.gender || 'INDETERMINADO',
        birthDate: initialData.birthDate || '',
        status: initialData.status || 'DISPONIVEL',
        cage: initialData.cage || '',
        initialWeight: '',
        photoUrl: initialData.photoUrl || ''
      });
    } else if (isOpen && !initialData) {
      setFormData({
        name: '',
        ringNumber: '',
        species: '',
        mutation: '',
        gender: 'INDETERMINADO',
        birthDate: '',
        status: 'DISPONIVEL',
        cage: '',
        initialWeight: '',
        photoUrl: ''
      });
    }
  }, [isOpen, initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file, 'birds');
    
    if (url) {
      setFormData(prev => ({ ...prev, photoUrl: url }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const birdToSave: any = {
      ...formData,
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      logs: initialData?.logs || [],
      weights: initialData?.weights || (formData.initialWeight ? [{
        id: Math.random().toString(),
        date: new Date().toISOString().split('T')[0],
        weight: Number(formData.initialWeight)
      }] : [])
    };

    await onSave(birdToSave);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: 'MACHO', label: 'Macho' },
    { value: 'FEMEA', label: 'Fêmea' },
    { value: 'INDETERMINADO', label: 'Indeterminado' }
  ];

  const statusOptions = [
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'REPRODUCAO', label: 'Em Reprodução' },
    { value: 'VENDIDO', label: 'Vendido' },
    { value: 'OBITO', label: 'Óbito' }
  ];

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Ave' : 'Nova Ave'}
    >
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.imageUploadSection}>
          <div className={styles.imageWrapper}>
            {formData.photoUrl ? (
              <img 
                src={formData.photoUrl} 
                alt="Preview" 
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
              id="bird-photo-upload"
            />
            <label htmlFor="bird-photo-upload" className={styles.uploadLabel}>
              {formData.photoUrl ? 'Trocar Foto' : 'Adicionar Foto'}
            </label>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Nome</label>
            <input
              required
              className={styles.input}
              placeholder="Ex: Zeus"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Anilha</label>
            <input
              required
              className={styles.input}
              placeholder="BR-2024-..."
              value={formData.ringNumber}
              onChange={(e) => handleChange('ringNumber', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Espécie</label>
          <input
            required
            className={styles.input}
            placeholder="Ex: Agapornis Roseicollis"
            value={formData.species}
            onChange={(e) => handleChange('species', e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Mutação</label>
          <input
            required
            className={styles.input}
            placeholder="Ex: Opalino Verde"
            value={formData.mutation}
            onChange={(e) => handleChange('mutation', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Combobox 
              label="Gênero"
              value={formData.gender}
              options={genderOptions}
              onChange={(val) => handleChange('gender', val)}
            />
          </div>
          <div className={styles.field}>
            <DatePicker 
              label="Nascimento"
              value={formData.birthDate}
              onChange={(date) => handleChange('birthDate', date)}
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>

        <div className={styles.row}>
            <div className={styles.field}>
            <Combobox 
              label="Status"
              value={formData.status}
              options={statusOptions}
              onChange={(val) => handleChange('status', val)}
            />
          </div>
          {!initialData && (
            <div className={styles.field}>
              <label className={styles.label}>Peso Inicial (g)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="Ex: 45"
                value={formData.initialWeight}
                onChange={(e) => handleChange('initialWeight', e.target.value)}
              />
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Gaiola</label>
          <input
            className={styles.input}
            placeholder="Nº ou Nome"
            value={formData.cage}
            onChange={(e) => handleChange('cage', e.target.value)}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          {initialData ? 'Salvar Alterações' : 'Cadastrar Ave'}
        </button>
      </form>
    </SheetModal>
  );
}