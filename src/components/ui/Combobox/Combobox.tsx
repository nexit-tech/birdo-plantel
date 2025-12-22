'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import styles from './Combobox.module.css';

export interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({ label, value, options, onChange, placeholder = 'Selecione...' }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div 
        className={clsx(styles.trigger, isOpen && styles.triggerActive)} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={clsx(styles.valueText, !selectedOption && styles.placeholder)}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={20} 
          className={clsx(styles.icon, isOpen && styles.iconRotated)} 
        />
      </div>

      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li 
              key={option.value} 
              className={clsx(styles.item, option.value === value && styles.selectedItem)}
              onClick={() => handleSelect(option.value)}
            >
              <span className={styles.itemLabel}>{option.label}</span>
              {option.value === value && <Check size={16} className={styles.checkIcon} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}