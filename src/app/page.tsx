'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useDashboard } from '@/hooks/useDashboard';
import { useFinance } from '@/hooks/useFinance';
import { useProfile } from '@/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { PdfGeneratorModal } from '@/components/features/PdfGeneratorModal/PdfGeneratorModal';
import { 
  Bird, 
  Users, 
  Egg, 
  Wallet, 
  Plus, 
  TrendingUp, 
  FileText,
  Trophy,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

export default function HomePage() {
  const { stats, isLoading: dashboardLoading } = useDashboard();
  const { transactions, isLoading: financeLoading } = useFinance();
  const { profile } = useProfile();
  const router = useRouter();
  
  const [greeting, setGreeting] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const balance = transactions.reduce((acc, curr) => {
    const type = curr.type?.toUpperCase();
    if (type === 'ENTRADA' || type === 'INCOME' || type === 'VENDA') {
      return acc + (Number(curr.amount) || 0);
    }
    return acc - (Number(curr.amount) || 0);
  }, 0);

  const isLoading = dashboardLoading || financeLoading;

  return (
    <div className={styles.container}>

      <header className={styles.header}>
        <span className={styles.welcomeText}>
          {greeting}, {profile?.name?.split(' ')[0] || 'Criador'} 👋
        </span>
        <h1 className={styles.title}>Painel de Controle</h1>
      </header>

      <div className={styles.statsGrid}>
        <button className={clsx(styles.statCard, styles.cardBlue)} onClick={() => router.push('/birds')}>
          <div className={styles.statIconWrapper}>
            <Bird size={20} color="white" />
          </div>
          <div>
            <div className={styles.statValue}>
              {isLoading ? '-' : stats?.totalBirds ?? 0}
            </div>
            <div className={styles.statLabel}>Aves no Plantel</div>
          </div>
          <Bird size={80} className={styles.cardDecoration} />
        </button>

        <button className={clsx(styles.statCard, styles.cardPurple)} onClick={() => router.push('/pairs')}>
          <div className={styles.statIconWrapper}>
            <Users size={20} color="white" />
          </div>
          <div>
            <div className={styles.statValue}>
              {isLoading ? '-' : stats?.totalPairs ?? 0}
            </div>
            <div className={styles.statLabel}>Casais Formados</div>
          </div>
          <Users size={80} className={styles.cardDecoration} />
        </button>

        <button className={clsx(styles.statCard, styles.cardOrange)}>
          <div className={styles.statIconWrapper}>
            <Egg size={20} color="white" />
          </div>
          <div>
            <div className={styles.statValue}>
              {isLoading ? '-' : stats?.activeChicks ?? 0}
            </div>
            <div className={styles.statLabel}>Filhotes Ativos</div>
          </div>
          <Egg size={80} className={styles.cardDecoration} />
        </button>

        <button className={clsx(styles.statCard, styles.cardGreen)} onClick={() => router.push('/finance')}>
          <div className={styles.statIconWrapper}>
            <Wallet size={20} color="white" />
          </div>
          <div>
            <div className={styles.statValue} style={{ fontSize: '24px' }}>
               <span style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>R$</span>
               {isLoading ? '-' : balance.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className={styles.statLabel}>Saldo em Caixa</div>
          </div>
          <Wallet size={80} className={styles.cardDecoration} />
        </button>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>O que você quer fazer?</h2>
        
        <div className={styles.actionsGrid}>
          <button 
            className={styles.actionCard}
            onClick={() => router.push('/birds?action=new')}
          >
            <div className={clsx(styles.actionIconBox, styles.iconBoxBlue)}>
              <Plus size={24} />
            </div>
            <span className={styles.actionTitle}>Cadastrar<br/>Ave</span>
          </button>

          {/* Nova Transação */}
          <button 
            className={styles.actionCard}
            onClick={() => router.push('/finance?action=new')}
          >
            <div className={clsx(styles.actionIconBox, styles.iconBoxGreen)}>
              <TrendingUp size={24} />
            </div>
            <span className={styles.actionTitle}>Lançar<br/>Finança</span>
          </button>

          <button 
            className={styles.actionCard}
            onClick={() => setIsPdfModalOpen(true)}
          >
            <div className={clsx(styles.actionIconBox, styles.iconBoxGray)}>
              <FileText size={24} />
            </div>
            <span className={styles.actionTitle}>Fichas &<br/>Relatórios</span>
          </button>

           <button 
            className={styles.actionCard}
            onClick={() => router.push('/pairs?action=new')}
          >
             <div className={clsx(styles.actionIconBox, styles.iconBoxPurple)}>
              <Users size={24} />
            </div>
            <span className={styles.actionTitle}>Novo<br/>Casal</span>
          </button>

          <button 
            className={clsx(styles.actionCard, styles.competitionCard)}
            onClick={() => router.push('/birds')}
          >
            <div className={styles.competitionContent}>
              <span className={styles.competitionTitle}>Modo Competição</span>
              <span className={styles.competitionDesc}>Ver fichas e pontuações</span>
            </div>
            <div className={styles.competitionIcon}>
              <Trophy size={24} />
            </div>
          </button>
        </div>
      </section>

      <PdfGeneratorModal 
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}