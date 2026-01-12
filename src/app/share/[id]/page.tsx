import { createClient } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Trophy, Dna, Calendar, Activity } from 'lucide-react';
import { Bird, ShareSettings } from '@/types';

async function getBirdPublic(id: string) {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('birds')
    .select(`
      *,
      competition_results (*)
    `)
    .eq('id', id)
    .single();

  return data;
}

export default async function PublicBirdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBirdPublic(id);

  if (!data || !data.is_public) {
    return notFound();
  }

  const bird = {
    ...data,
    ringNumber: data.ring_number,
    birthDate: data.birth_date,
    photoUrl: data.photo_url,
    competitionResults: data.competition_results || []
  };

  const settings: ShareSettings = data.share_settings || {
    showGenealogy: true,
    showCompetitions: true,
    showHealth: false,
    showReproduction: false,
    showPhotos: true
  };

  const birthDate = new Date(bird.birthDate).toLocaleDateString('pt-BR');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        <div className={styles.header}>
          <div className={styles.statusBadge}>{bird.status}</div>
          
          <div className={styles.avatarContainer}>
            {bird.photoUrl ? (
              <img src={bird.photoUrl} alt={bird.name} className={styles.avatarImg} />
            ) : (
              <span style={{fontSize: 32}}>{bird.gender === 'MACHO' ? '♂' : '♀'}</span>
            )}
          </div>
          
          <h1 className={styles.birdName}>{bird.name}</h1>
          <span className={styles.ringNumber}>{bird.ringNumber}</span>
        </div>

        <div className={styles.content}>
          
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Ficha Técnica</div>
            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Espécie</span>
                <span className={styles.infoValue}>{bird.species}</span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Mutação</span>
                <span className={styles.infoValue}>{bird.mutation || '-'}</span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Sexo</span>
                <span className={styles.infoValue}>{bird.gender}</span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>Nascimento</span>
                <span className={styles.infoValue}>{birthDate}</span>
              </div>
            </div>
          </div>

          {settings.showGenealogy && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <Dna size={14} /> Linhagem
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoBox} style={{background: '#FFF', border: '1px solid #E5E5EA'}}>
                  <span className={styles.infoLabel}>Pai</span>
                  <span className={styles.infoValue} style={{color: bird.father_id ? '#007AFF' : '#C7C7CC'}}>
                    {bird.father_id ? 'Registrado' : 'Não informado'}
                  </span>
                </div>
                <div className={styles.infoBox} style={{background: '#FFF', border: '1px solid #E5E5EA'}}>
                  <span className={styles.infoLabel}>Mãe</span>
                  <span className={styles.infoValue} style={{color: bird.mother_id ? '#FF2D55' : '#C7C7CC'}}>
                    {bird.mother_id ? 'Registrado' : 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {settings.showCompetitions && bird.competitionResults.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <Trophy size={14} /> Histórico Competitivo
              </div>
              <div className={styles.compList}>
                {bird.competitionResults.map((comp: any) => (
                  <div key={comp.id} className={styles.compItem}>
                    <div className={`${styles.placeBadge} ${
                      comp.place === 1 ? styles.gold : 
                      comp.place === 2 ? styles.silver : 
                      comp.place === 3 ? styles.bronze : ''
                    }`}>
                      {comp.place}º
                    </div>
                    <div className={styles.compDetails}>
                      <span className={styles.compName}>{comp.tournament_name}</span>
                      <span className={styles.compDate}>
                        {new Date(comp.event_date).toLocaleDateString('pt-BR')}
                        {comp.points && ` • ${comp.points} pts`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className={styles.footer}>
          Verificado por <span className={styles.logo}>Birdo App</span>
        </div>
      </div>
    </div>
  );
}