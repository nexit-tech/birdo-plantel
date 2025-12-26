'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bird, Users, PieChart, Settings } from 'lucide-react';
import clsx from 'clsx';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Evita erro de hidratação: só renderiza lógica de rota após montar no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Observer para Modais (sua lógica original)
  useEffect(() => {
    const checkModalOpen = () => {
      const overlays = document.querySelectorAll('[class*="overlay"]');
      const hasOpenModal = Array.from(overlays).some((el) => {
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });
      setIsHidden(hasOpenModal);
    };

    const observer = new MutationObserver(checkModalOpen);
    
    // Adiciona verificação inicial segura
    if (typeof document !== 'undefined') {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      checkModalOpen();
    }

    return () => observer.disconnect();
  }, []);

  // SE não estiver montado, ou se a rota for login, não exibe nada.
  // O null aqui é seguro pois ocorre após o 'use client' assumir.
  if (!isMounted || pathname === '/login') {
    return null;
  }

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Aves', href: '/birds', icon: Bird },
    { label: 'Casais', href: '/pairs', icon: Users },
    { label: 'Finanças', href: '/finance', icon: PieChart },
    { label: 'Ajustes', href: '/settings', icon: Settings },
  ];

  return (
    <nav className={clsx(styles.nav, isHidden && styles.hidden)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(styles.item, isActive && styles.active)}
          >
            <item.icon size={24} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}