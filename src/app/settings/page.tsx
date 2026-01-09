'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header/Header';
import { SettingsRow } from './components/SettingsRow/SettingsRow';
import { EditProfileModal } from './components/EditProfileModal/EditProfileModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { SheetModal } from '@/components/ui/SheetModal/SheetModal';
import { useProfile } from '@/hooks/useProfile';
import { createClient } from '@/lib/supabase/client';
import { Breeder } from '@/types';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  MessageCircle, 
  MapPin, 
  FileText,
  Lock
} from 'lucide-react';
import styles from './page.module.css';

export default function Settings() {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useProfile();
  const supabase = createClient();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateBreeder = async (updated: Breeder) => {
    await updateProfile(updated);
    setIsEditModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login'); 
  };

  const handleContact = () => {
    const phoneNumber = '5511999999999';
    const message = encodeURIComponent('Olá, preciso de ajuda com o app Birdo Plantel.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      alert("Erro ao atualizar senha: " + error.message);
    } else {
      alert("Senha atualizada com sucesso!");
      setNewPassword('');
      setIsPrivacyModalOpen(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  const displayProfile = profile || {
    name: 'Usuário',
    email: '-',
    registryNumber: '',
    city: '-',
    id: '',
    phone: '',
    photoUrl: ''
  };

  return (
    <div className={styles.container}>
      <Header title="Ajustes" />

      <div className={styles.scrollContent}>
        <div className={styles.hero}>
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
          <h2 className={styles.heroTitle}>{displayProfile.name}</h2>
          <p className={styles.heroSubtitle}>{displayProfile.email}</p>
          <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
            Editar Perfil
          </button>
        </div>

        <div className={styles.sectionTitle}>Geral</div>
        <div className={styles.group}>
          <SettingsRow 
            icon={<User size={20} />} 
            label="Dados do Criadouro" 
            value="Editar"
            onClick={() => setIsEditModalOpen(true)}
          />
          <SettingsRow 
            icon={<MapPin size={20} />} 
            label="Localização" 
            value={displayProfile.city || 'Definir'}
            onClick={() => setIsEditModalOpen(true)}
          />
        </div>

        <div className={styles.sectionTitle}>Segurança e Suporte</div>
        <div className={styles.group}>
          <SettingsRow 
            icon={<Bell size={20} />} 
            label="Notificações" 
            value="Ativado"
          />
          <SettingsRow 
            icon={<Lock size={20} />} 
            label="Alterar Senha" 
            onClick={() => setIsPrivacyModalOpen(true)}
          />
          <SettingsRow 
            icon={<FileText size={20} />} 
            label="Termos de Uso" 
            onClick={() => setIsTermsModalOpen(true)}
          />
          <SettingsRow 
            icon={<MessageCircle size={20} />} 
            label="Fale Conosco" 
            onClick={handleContact}
          />
        </div>

        <div className={styles.group}>
          <SettingsRow 
            icon={<LogOut size={20} />} 
            label="Sair da Conta" 
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

      <SheetModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Segurança"
      >
        <div className={styles.modalContent}>
          <p>Para sua segurança, você pode atualizar sua senha de acesso periodicamente.</p>
          <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nova Senha</label>
              <input 
                type="password" 
                className={styles.input} 
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.saveBtn} disabled={!newPassword}>
              Atualizar Senha
            </button>
          </form>
        </div>
      </SheetModal>

      <SheetModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Termos de Uso"
      >
        <div className={styles.modalContent}>
          <h3>1. Aceitação</h3>
          <p>Ao utilizar o Birdo Plantel, você concorda com estes termos.</p>
          
          <h3>2. Privacidade</h3>
          <p>Seus dados são armazenados de forma segura e não são compartilhados com terceiros sem consentimento.</p>
          
          <h3>3. Responsabilidades</h3>
          <p>O usuário é responsável pela veracidade das informações genealógicas inseridas.</p>
        </div>
      </SheetModal>

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