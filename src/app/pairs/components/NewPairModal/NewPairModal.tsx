'use client';

import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Bird, Pair, PairStatus } from '@/types';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { MOCK_BIRDS } from '@/data/mock';
import styles from './NewPairModal.module.css';
import clsx from 'clsx';

interface NewPairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pair: Pair) => void;
}

export function NewPairModal({ isOpen, onClose, onSave }: NewPairModalProps) {
  const [step, setStep] = useState<'DETAILS' | 'SELECT_MALE' | 'SELECT_FEMALE'>('DETAILS');
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    cage: '',
    maleId: '',
    femaleId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.maleId || !formData.femaleId) return;
    
    const newPair: Pair = {
      id: Math.random().toString(),
      name: formData.name || `Casal ${Math.floor(Math.random() * 1000)}`,
      startDate: formData.startDate,
      cage: formData.cage,
      maleId: formData.maleId,
      femaleId: formData.femaleId,
      status: 'ATIVO'
    };

    onSave(newPair);
    onClose();
    setStep('DETAILS');
    setFormData({ name: '', startDate: '', cage: '', maleId: '', femaleId: '' });
  };

  const renderBirdSelector = (gender: 'MACHO' | 'FEMEA') => {
    const candidates = MOCK_BIRDS.filter(b => 
      b.gender === gender && 
      (b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       b.ringNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className={styles.selectorContainer}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            className={styles.searchInput}
            placeholder="Buscar ave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.list}>
          {candidates.map(bird => (
            <button key={bird.id} className={styles.item} onClick={() => {
              setFormData(prev => ({ ...prev, [gender === 'MACHO' ? 'maleId' : 'femaleId']: bird.id }));
              setStep('DETAILS');
              setSearchTerm('');
            }}>
              <div className={styles.itemAvatar}>{gender === 'MACHO' ? '♂' : '♀'}</div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{bird.name}</span>
                <span className={styles.itemRing}>{bird.ringNumber}</span>
              </div>
            </button>
          ))}
        </div>
        <button className={styles.backBtn} onClick={() => setStep('DETAILS')}>Voltar</button>
      </div>
    );
  };

  const selectedMale = MOCK_BIRDS.find(b => b.id === formData.maleId);
  const selectedFemale = MOCK_BIRDS.find(b => b.id === formData.femaleId);

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {step === 'DETAILS' ? 'Novo Casal' : step === 'SELECT_MALE' ? 'Selecionar Macho' : 'Selecionar Fêmea'}
          </h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={24} /></button>
        </div>

        {step === 'DETAILS' ? (
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Nome do Casal (Opcional)</label>
              <input 
                className={styles.input} 
                placeholder="Ex: Casal 01"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className={styles.slotsRow}>
              <button className={clsx(styles.slot, formData.maleId && styles.filledSlot)} onClick={() => setStep('SELECT_MALE')}>
                <span className={styles.slotLabel}>MACHO</span>
                {selectedMale ? (
                  <div className={styles.selectedInfo}>
                    <span className={styles.selectedName}>{selectedMale.name}</span>
                    <span className={styles.selectedRing}>{selectedMale.ringNumber}</span>
                  </div>
                ) : <span className={styles.placeholder}>+ Selecionar</span>}
              </button>
              
              <button className={clsx(styles.slot, formData.femaleId && styles.filledSlot)} onClick={() => setStep('SELECT_FEMALE')}>
                <span className={styles.slotLabel}>FÊMEA</span>
                {selectedFemale ? (
                  <div className={styles.selectedInfo}>
                    <span className={styles.selectedName}>{selectedFemale.name}</span>
                    <span className={styles.selectedRing}>{selectedFemale.ringNumber}</span>
                  </div>
                ) : <span className={styles.placeholder}>+ Selecionar</span>}
              </button>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <DatePicker 
                  label="Data de Início"
                  value={formData.startDate}
                  onChange={date => setFormData({...formData, startDate: date})}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Gaiola</label>
                <input 
                  className={styles.input} 
                  placeholder="Nº"
                  value={formData.cage}
                  onChange={e => setFormData({...formData, cage: e.target.value})}
                />
              </div>
            </div>

            <button 
              className={styles.submitBtn} 
              disabled={!formData.maleId || !formData.femaleId}
              onClick={handleSubmit}
            >
              Criar Casal
            </button>
          </div>
        ) : (
          renderBirdSelector(step === 'SELECT_MALE' ? 'MACHO' : 'FEMEA')
        )}
      </div>
    </div>
  );
}