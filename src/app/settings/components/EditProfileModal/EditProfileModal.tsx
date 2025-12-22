'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Breeder } from '@/types';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  breeder: Breeder | null;
  onSave: (data: Breeder) => void;
}

export function EditProfileModal({ isOpen, onClose, breeder, onSave }: EditProfileModalProps) {
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
    if (breeder) {
      setFormData(breeder);
    }
  }, [breeder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>Editar Perfil</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nome do Criadouro</label>
            <input 
              className={styles.input}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Registro / CTF</label>
            <input 
              className={styles.input}
              value={formData.registryNumber}
              onChange={e => setFormData({...formData, registryNumber: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input 
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefone</label>
            <input 
              className={styles.input}
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

           <div className={styles.field}>
            <label className={styles.label}>Cidade / UF</label>
            <input 
              className={styles.input}
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}