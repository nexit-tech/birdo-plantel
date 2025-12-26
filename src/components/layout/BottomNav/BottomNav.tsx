'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bird, Users, PieChart, Settings } from 'lucide-react';
import clsx from 'clsx';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkModalOpen = () => {
      const overlays = document.querySelectorAll('[class*="overlay"]');
      const hasOpenModal = Array.from(overlays).some((el) => {
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });
      setIsModalOpen(hasOpenModal);
    };

    const observer = new MutationObserver(checkModalOpen);
    
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

  if (!isMounted || pathname === '/login') {
    return null;
  }

  const isBirdDetails = pathname.startsWith('/birds/') && pathname !== '/birds';
  const isPairDetails = pathname.startsWith('/pairs/') && pathname !== '/pairs';
  const shouldHide = isModalOpen || isBirdDetails || isPairDetails;

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Aves', href: '/birds', icon: Bird },
    { label: 'Casais', href: '/pairs', icon: Users },
    { label: 'Finanças', href: '/finance', icon: PieChart },
    { label: 'Ajustes', href: '/settings', icon: Settings },
  ];

  return (
    <nav className={clsx(styles.nav, shouldHide && styles.hidden)}>
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