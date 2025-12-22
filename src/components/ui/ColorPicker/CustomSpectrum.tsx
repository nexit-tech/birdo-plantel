'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { hexToHsv, hsvToHex, hsvToRgb, rgbToHex } from '@/utils/color';
import { Pipette } from 'lucide-react';
import styles from './CustomSpectrum.module.css';

interface CustomSpectrumProps {
  color: string;
  onChange: (color: string) => void;
}

export function CustomSpectrum({ color, onChange }: CustomSpectrumProps) {
  const [hsv, setHsv] = useState(hexToHsv(color));
  const satRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [isDraggingSat, setIsDraggingSat] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  useEffect(() => {
    if (!isDraggingSat && !isDraggingHue) {
      setHsv(hexToHsv(color));
    }
  }, [color, isDraggingSat, isDraggingHue]);

  const handleSatChange = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!satRef.current) return;
    const rect = satRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    const newS = x * 100;
    const newV = 100 - (y * 100);
    
    setHsv(prev => {
      const newHsv = { ...prev, s: newS, v: newV };
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
      return newHsv;
    });
  }, [onChange]);

  const handleHueChange = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const newH = x * 360;
    
    setHsv(prev => {
      const newHsv = { ...prev, h: newH };
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
      return newHsv;
    });
  }, [onChange]);

  useEffect(() => {
    const handleUp = () => {
      setIsDraggingSat(false);
      setIsDraggingHue(false);
    };
    const handleMove = (e: MouseEvent) => {
      if (isDraggingSat) handleSatChange(e);
      if (isDraggingHue) handleHueChange(e);
    };
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [isDraggingSat, isDraggingHue, handleSatChange, handleHueChange]);

  const rgb = hsvToRgb(hsv.h, hsv.s / 100, hsv.v / 100);

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: string) => {
    const num = Math.min(255, Math.max(0, Number(value) || 0));
    const newRgb = { ...rgb, [key]: num };
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleEyedropper = async () => {
    if (!window.EyeDropper) return;
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={styles.spectrumContainer}>
      <div 
        className={styles.saturationArea} 
        ref={satRef}
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        onMouseDown={(e) => { setIsDraggingSat(true); handleSatChange(e); }}
      >
        <div className={styles.saturationWhite}>
          <div className={styles.saturationBlack} />
        </div>
        <div 
          className={styles.pointer} 
          style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }} 
        />
      </div>

      <div className={styles.controlsRow}>
        <button className={styles.eyeDropperBtn} onClick={handleEyedropper} title="Conta-gotas">
          <Pipette size={14} />
        </button>
        <div className={styles.slidersCol}>
          <div 
            className={styles.hueSlider} 
            ref={hueRef}
            onMouseDown={(e) => { setIsDraggingHue(true); handleHueChange(e); }}
          >
            <div 
              className={styles.sliderThumb} 
              style={{ left: `${(hsv.h / 360) * 100}%` }} 
            />
          </div>
        </div>
        <div className={styles.colorPreview} style={{ backgroundColor: color }} />
      </div>

      <div className={styles.inputsRow}>
        <div className={styles.inputGroup}>
          <input 
            value={rgb.r} 
            onChange={e => handleRgbChange('r', e.target.value)}
            className={styles.numInput} 
          />
          <label>R</label>
        </div>
        <div className={styles.inputGroup}>
          <input 
            value={rgb.g} 
            onChange={e => handleRgbChange('g', e.target.value)}
            className={styles.numInput} 
          />
          <label>G</label>
        </div>
        <div className={styles.inputGroup}>
          <input 
            value={rgb.b} 
            onChange={e => handleRgbChange('b', e.target.value)}
            className={styles.numInput} 
          />
          <label>B</label>
        </div>
      </div>
    </div>
  );
}