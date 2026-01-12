import React from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.css';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'rounded' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  width, 
  height,
  style,
  ...props 
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        styles.skeleton,
        {
          [styles['rounded-md']]: variant === 'rounded',
          [styles['rounded-full']]: variant === 'circular',
        },
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}