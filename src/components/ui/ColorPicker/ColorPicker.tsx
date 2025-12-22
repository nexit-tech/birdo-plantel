'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Hash } from 'lucide-react';
import { CustomSpectrum } from './CustomSpectrum';
import styles from './ColorPicker.module.css';
import clsx from 'clsx';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const PRESETS = [
  '#FFFFFF', '#F2F2F7', '#E5E5EA',
  '#FECACA', '#FDE68A', '#A7F3D0',
  '#BFDBFE', '#C7D2FE', '#DDD6FE',
  '#FBCFE8', '#F5D0FE', '#E9D5FF'
];

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setHexInput(newVal);
    if (/^#[0-9A-F]{6}$/i.test(newVal)) {
      onChange(newVal);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>{label}</label>
      
      <button 
        className={clsx(styles.trigger, isOpen && styles.triggerActive)} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.preview} style={{ backgroundColor: value }} />
        <span className={styles.valueText}>{value.toUpperCase()}</span>
        <ChevronDown size={16} className={styles.arrow} />
      </button>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Cores Sugeridas</span>
            <div className={styles.grid}>
              {PRESETS.map((color) => (
                <button
                  key={color}
                  className={clsx(styles.swatch, value === color && styles.swatchActive)}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Personalizar</span>
            
            {/* NOVO COMPONENTE CUSTOMIZADO */}
            <CustomSpectrum 
              color={value} 
              onChange={onChange} 
            />

            <div className={styles.inputRow} style={{ marginTop: 10 }}>
              <div className={styles.hexInputWrapper}>
                <Hash size={14} className={styles.hashIcon} />
                <input 
                  className={styles.hexInput}
                  value={hexInput}
                  onChange={handleHexChange}
                  maxLength={7}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}