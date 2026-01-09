import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export function Card({ children, className, onClick, noPadding }: CardProps) {
  return (
    <div 
      className={clsx(styles.card, className)}
      onClick={onClick}
      style={noPadding ? { padding: 0 } : undefined}
    >
      {children}
    </div>
  );
}