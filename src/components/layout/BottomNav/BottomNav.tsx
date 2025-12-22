'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bird, Users, PieChart, Settings } from 'lucide-react';
import clsx from 'clsx';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Aves', href: '/birds', icon: Bird },
    { label: 'Casais', href: '/pairs', icon: Users },
    { label: 'Finanças', href: '/finance', icon: PieChart },
    { label: 'Ajustes', href: '/settings', icon: Settings },
  ];

  return (
    <nav className={styles.nav}>
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