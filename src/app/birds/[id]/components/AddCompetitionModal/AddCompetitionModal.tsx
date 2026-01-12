'use client';

import React, { useState } from 'react';
import styles from './AddCompetitionModal.module.css';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { CompetitionResult } from '@/types'; // Importar tipos
import { 
  Trophy, 
  MapPin, 
  Tag, 
  FileText, 
  Target, 
  Check
} from 'lucide-react';

interface AddCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  birdId: string;
  onSave: (data: Omit<CompetitionResult, 'id'>) => Promise<any>;
}

interface FormData {
  tournament_name: string;
  place: string;
  event_date: string; 
  city: string;
  category: string;
  points: string;
  obs: string;
}

export function AddCompetitionModal({ isOpen, onClose, birdId, onSave }: AddCompetitionModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    tournament_name: '',
    place: '',
    event_date: new Date().toISOString().split('T')[0],
    city: '',
    category: '',
    points: '',
    obs: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tournament_name || !formData.place) return;

    try {
      setLoading(true);

      await onSave({
        bird_id: birdId,
        tournament_name: formData.tournament_name,
        place: parseInt(formData.place),
        event_date: formData.event_date,
        city: formData.city,
        category: formData.category,
        points: formData.points ? parseFloat(formData.points) : undefined,
        obs: formData.obs
      });
    
      setFormData({
        tournament_name: '',
        place: '',
        event_date: new Date().toISOString().split('T')[0],
        city: '',
        category: '',
        points: '',
        obs: ''
      });
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar resultado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetModal isOpen={isOpen} onClose={onClose} title="Novo Resultado">
      <form onSubmit={handleSubmit} className={styles.container}>

        <div className={styles.heroSection}>
          <span className={styles.heroLabel}>Qual foi a colocação?</span>
          <div className={styles.placeInputWrapper}>
            <input 
              type="number"
              inputMode="numeric"
              className={styles.bigPlaceInput}
              value={formData.place}
              onChange={e => setFormData(prev => ({ ...prev, place: e.target.value }))}
              placeholder="1"
              required
              autoFocus
            />
            <span className={styles.placeSuffix}>º</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <span className={styles.groupTitle}>
            <Trophy size={16} /> Detalhes do Evento
          </span>
          
          <div className={styles.row}>
            <div className={styles.fieldWrapper} style={{ gridColumn: 'span 2' }}>
              <Trophy size={18} className={styles.inputIcon} />
              <input 
                className={styles.fluidInput}
                value={formData.tournament_name}
                onChange={e => setFormData(prev => ({ ...prev, tournament_name: e.target.value }))}
                placeholder="Nome do Torneio *"
                required
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <DatePicker 
                label="Data do Evento"
                value={formData.event_date}
                onChange={(date) => setFormData(prev => ({ ...prev, event_date: date }))}
              />
            </div>

            <div className={styles.fieldWrapper}>
              <MapPin size={18} className={styles.inputIcon} />
              <input 
                className={styles.fluidInput}
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Cidade"
              />
            </div>

            <div className={styles.fieldWrapper}>
              <Tag size={18} className={styles.inputIcon} />
              <input 
                className={styles.fluidInput}
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Categoria"
              />
            </div>

             <div className={styles.fieldWrapper} style={{ gridColumn: 'span 2' }}>
              <Target size={18} className={styles.inputIcon} />
              <input 
                type="number"
                step="0.1"
                className={styles.fluidInput}
                value={formData.points}
                onChange={e => setFormData(prev => ({ ...prev, points: e.target.value }))}
                placeholder="Pontuação (Opcional)"
              />
            </div>
          </div>
        </div>

        <div className={styles.textAreaWrapper}>
          <FileText size={18} className={styles.inputIcon} style={{ marginTop: 2 }} />
          <textarea 
            className={styles.fluidTextarea}
            value={formData.obs}
            onChange={e => setFormData(prev => ({ ...prev, obs: e.target.value }))}
            placeholder="Observações adicionais sobre o desempenho..."
          />
        </div>

        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? 'Salvando...' : (
            <>
              <Check size={20} /> Salvar Conquista
            </>
          )}
        </button>
      </form>
    </SheetModal>
  );
}