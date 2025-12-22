'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bird as BirdIcon, Users, Egg, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/Header/Header';
import { Card } from '@/components/ui/Card/Card';
import { PdfGeneratorModal } from '@/components/features/PdfGeneratorModal/PdfGeneratorModal';
import { useDashboard } from '@/hooks';
import styles from './page.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { stats, isLoading } = useDashboard();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const dashboardStats = [
    { 
      label: 'Total de Aves', 
      value: isLoading ? '-' : stats.totalBirds, 
      icon: BirdIcon,
      color: '#2563eb' 
    },
    { 
      label: 'Casais Formados', 
      value: isLoading ? '-' : stats.totalPairs, 
      icon: Users,
      color: '#db2777' 
    },
    { 
      label: 'Filhotes Ativos', 
      value: isLoading ? '-' : stats.activeChicks, 
      icon: Egg,
      color: '#d97706' 
    },
    { 
      label: 'Disponíveis', 
      value: isLoading ? '-' : stats.availableForSale, 
      icon: DollarSign,
      color: '#16a34a' 
    },
  ];

  return (
    <div className={styles.container}>
      <Header useLogo />
      
      <div className={styles.grid}>
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}20` }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionCard} onClick={() => router.push('/birds?action=new')}>
            <span>Nova Ave</span>
          </button>
          
          <button className={styles.actionCard} onClick={() => router.push('/pairs?action=new')}>
            <span>Novo Casal</span>
          </button>
          <button className={styles.actionCard} onClick={() => router.push('/pairs')}>
            <span>Registrar Postura</span>
          </button>

          <button className={styles.actionCard} onClick={() => router.push('/finance?action=new')}>
            <span>Lançar Finança</span>
          </button>
          <button className={styles.actionCard} onClick={() => router.push('/finance')}>
            <span>Ver Extrato</span>
          </button>

          <button className={styles.actionCard} onClick={() => setIsPdfModalOpen(true)}>
            <span>Gerar Ficha</span>
          </button>
        </div>
      </div>

      <PdfGeneratorModal 
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}