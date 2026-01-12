import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Trophy, Dna, Calendar, Activity, Star } from 'lucide-react';
import { ShareSettings } from '@/types';

async function getBirdPublic(id: string) {
  const supabase = await createClient();
  
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

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/birds`;
  
  if (path.startsWith('birds/')) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
  }
  
  return `${baseUrl}/${path}`;
};

export default async function PublicBirdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBirdPublic(id);

  if (!data || !data.is_public) {
    return notFound();
  }

  const settings: ShareSettings = data.share_settings || {
    showGenealogy: true,
    showCompetitions: true,
    showHealth: false,
    showReproduction: false,
    showPhotos: true
  };

  const bird = {
    ...data,
    ringNumber: data.ring_number,
    birthDate: data.birth_date,
    photoUrl: getImageUrl(data.photo_url), 
    competitionResults: data.competition_results || []
  };

  const hasGenealogy = bird.father_id || bird.mother_id;
  const hasCompetitions = bird.competitionResults.length > 0;
  
  const showGenealogySection = settings.showGenealogy && hasGenealogy;
  const showCompetitionsSection = settings.showCompetitions && hasCompetitions;
  const showRealPhoto = settings.showPhotos !== false && !!bird.photoUrl;

  const birthDate = bird.birthDate ? new Date(bird.birthDate).toLocaleDateString('pt-BR') : 'Não informado';
  const genderLabel = bird.gender === 'MACHO' ? 'Macho' : bird.gender === 'FEMEA' ? 'Fêmea' : 'Indeterminado';

  return (
    <div className={styles.container}>
      <main className={styles.contentWrapper}>
        
        {/* Seção de Perfil - Foco na Imagem */}
        <div className={styles.profileSection}>
          <div className={styles.imageWrapper}>
            {showRealPhoto ? (
              <img src={bird.photoUrl} alt={bird.name} className={styles.birdPhoto} />
            ) : (
              <div className={styles.placeholderPhoto}>
                <span className={styles.placeholderInitial}>{bird.name.charAt(0)}</span>
              </div>
            )}
            <div className={`${styles.genderBadge} ${bird.gender === 'MACHO' ? styles.male : bird.gender === 'FEMEA' ? styles.female : ''}`}>
              {bird.gender === 'MACHO' ? '♂' : bird.gender === 'FEMEA' ? '♀' : '?'}
            </div>
          </div>

          <div className={styles.headerInfo}>
            <h1 className={styles.birdName}>{bird.name}</h1>
            <div className={styles.mainBadges}>
              <span className={styles.ringBadge}>{bird.ringNumber || 'S/ Anilha'}</span>
              <span className={styles.statusBadge}>{bird.status}</span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.dataGrid}>
          
          <div className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <Activity size={16} />
              <span>Ficha Técnica</span>
            </div>
            <div className={styles.statsList}>
              <div className={styles.statRow}>
                <span className={styles.label}>Espécie</span>
                <span className={styles.value}>{bird.species}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Mutação</span>
                <span className={styles.value}>{bird.mutation || '-'}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Sexo</span>
                <span className={styles.value}>{genderLabel}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.label}>Nascimento</span>
                <div className={styles.valueWithIcon}>
                  <Calendar size={14} />
                  <span>{birthDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Linhagem */}
          {showGenealogySection && (
            <div className={styles.dataCard}>
              <div className={styles.cardHeader}>
                <Dna size={16} />
                <span>Genealogia</span>
              </div>
              <div className={styles.genealogyList}>
                <div className={styles.parentItem}>
                  <span className={styles.parentLabel}>Pai</span>
                  <span className={`${styles.parentValue} ${bird.father_id ? styles.registered : ''}`}>
                    {bird.father_id ? 'Registrado no Plantel' : 'Não informado'}
                  </span>
                </div>
                <div className={styles.parentItem}>
                  <span className={styles.parentLabel}>Mãe</span>
                  <span className={`${styles.parentValue} ${bird.mother_id ? styles.registered : ''}`}>
                    {bird.mother_id ? 'Registrado no Plantel' : 'Não informado'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {showCompetitionsSection && (
            <div className={`${styles.dataCard} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <Trophy size={16} />
                <span>Títulos e Prêmios</span>
              </div>
              <div className={styles.competitionsList}>
                {bird.competitionResults.map((comp: any) => (
                  <div key={comp.id} className={styles.competitionItem}>
                    <div className={styles.medalIcon}>
                      <Star size={16} fill={comp.place === 1 ? "#FFD700" : comp.place === 2 ? "#C0C0C0" : "#CD7F32"} stroke="none" />
                    </div>
                    <div className={styles.compContent}>
                      <span className={styles.compPlace}>{comp.place}º Lugar</span>
                      <span className={styles.compName}>{comp.tournament_name}</span>
                    </div>
                    <span className={styles.compDate}>
                      {new Date(comp.event_date).getFullYear()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <footer className={styles.footer}>
          <p>Birdo App</p>
        </footer>

      </main>
    </div>
  );
}