'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { SettingsRow } from './components/SettingsRow/SettingsRow';
import { EditProfileModal } from './components/EditProfileModal/EditProfileModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { useProfile } from '@/hooks/useProfile';
import { createClient } from '@/lib/supabase/client';
import { Breeder } from '@/types';
import { User, Bell, Shield, LogOut, Mail, Award, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function Settings() {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useProfile();
  const supabase = createClient();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleUpdateBreeder = async (updated: Breeder) => {
    await updateProfile(updated);
    setIsEditModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login'); 
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Carregando perfil...</div>;
  }

  const displayProfile = profile || {
    name: 'Usuário',
    email: '-',
    registryNumber: '-',
    city: '-',
    id: '',
    phone: '',
    photoUrl: ''
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Ajustes</h1>

        <div className={styles.profileSection} onClick={() => setIsEditModalOpen(true)}>
          <div className={styles.avatarLarge}>
            {displayProfile.photoUrl ? (
              <img 
                src={displayProfile.photoUrl} 
                alt={displayProfile.name} 
                className={styles.avatarImage} 
              />
            ) : (
              <span className={styles.avatarInitial}>
                {displayProfile.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{displayProfile.name}</h2>
            <span className={styles.profileSub}>{displayProfile.email}</span>
            {displayProfile.registryNumber && (
              <span className={styles.profileRegistry}>Reg: {displayProfile.registryNumber}</span>
            )}
          </div>
          <button className={styles.editBtn}>Editar</button>
        </div>

        <div className={styles.listGroup}>
          <SettingsRow 
            icon={<User size={18} color="white" />} 
            label="Dados do Criadouro" 
            value="Completo"
            onClick={() => setIsEditModalOpen(true)}
          />
          <SettingsRow 
            icon={<MapPin size={18} color="white" />} 
            label="Localização" 
            value={displayProfile.city || 'Definir'}
          />
          <SettingsRow 
            icon={<Award size={18} color="white" />} 
            label="Assinatura" 
            value="Free"
          />
        </div>

        <div className={styles.listGroup}>
          <SettingsRow 
            icon={<Bell size={18} color="white" />} 
            label="Notificações" 
          />
          <SettingsRow 
            icon={<Shield size={18} color="white" />} 
            label="Privacidade e Segurança" 
          />
          <SettingsRow 
            icon={<Mail size={18} color="white" />} 
            label="Fale Conosco" 
          />
        </div>

        <div className={styles.listGroup}>
          <SettingsRow 
            icon={<LogOut size={18} color="white" />} 
            label="Sair" 
            isDanger
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div>

        <div className={styles.version}>
          Versão 1.0.0 (Beta)
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profile}
        onSave={handleUpdateBreeder}
      />

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Sair da Conta?"
        message="Você precisará fazer login novamente para acessar seus dados."
        confirmLabel="Sair"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}