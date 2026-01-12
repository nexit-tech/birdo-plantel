'use client';

import React from 'react';
import { SWRConfig } from 'swr';

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false, 
        revalidateOnReconnect: true,
        refreshInterval: 0, 
        shouldRetryOnError: false,
        dedupingInterval: 5000, 
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}