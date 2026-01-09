'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { hexToHsv, hsvToHex, hsvToRgb, rgbToHex } from '@/utils/color';
import { Pipette } from 'lucide-react';
import clsx from 'clsx';
import styles from './CustomSpectrum.module.css';

type InteractionEvent = 
  | MouseEvent 
  | TouchEvent 
  | React.MouseEvent<HTMLDivElement> 
  | React.TouchEvent<HTMLDivElement>;

interface CustomSpectrumProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'color'> {
  color: string;
  onChange: (color: string) => void;
}

export function CustomSpectrum({ color, onChange, className, ...props }: CustomSpectrumProps) {
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

  const getClientPos = (e: InteractionEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { 
      x: (e as MouseEvent | React.MouseEvent).clientX, 
      y: (e as MouseEvent | React.MouseEvent).clientY 
    };
  };

  const handleSatChange = useCallback((e: InteractionEvent) => {
    if (!satRef.current) return;
    
    const { x: clientX, y: clientY } = getClientPos(e);
    const rect = satRef.current.getBoundingClientRect();
    
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    const newS = x * 100;
    const newV = 100 - (y * 100);
    
    setHsv(prev => {
      const newHsv = { ...prev, s: newS, v: newV };
      onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
      return newHsv;
    });
  }, [onChange]);

  const handleHueChange = useCallback((e: InteractionEvent) => {
    if (!hueRef.current) return;
    
    const { x: clientX } = getClientPos(e);
    const rect = hueRef.current.getBoundingClientRect();
    
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
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

    const handleMove = (e: Event) => {
      if (isDraggingSat) {
        if (e.cancelable) e.preventDefault();
        handleSatChange(e as unknown as InteractionEvent);
      }
      if (isDraggingHue) {
        if (e.cancelable) e.preventDefault();
        handleHueChange(e as unknown as InteractionEvent);
      }
    };

    if (isDraggingSat || isDraggingHue) {
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('touchmove', handleMove, { passive: false });
    }

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
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

    const eyeDropper = new (window as any).EyeDropper();
    try {

      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      console.log('Eyedropper canceled/failed', e);
    }
  };

  return (
    <div className={clsx(styles.spectrumContainer, className)} {...props}>
      <div 
        className={styles.saturationArea} 
        ref={satRef}
        style={{ 
          backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
          touchAction: 'none',
          userSelect: 'none'
        }}
        onMouseDown={(e) => { 

          if (e.button !== 0) return;
          setIsDraggingSat(true); 
          handleSatChange(e); 
        }}
        onTouchStart={(e) => { 
          setIsDraggingSat(true); 
          handleSatChange(e); 
        }}
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
        <button 
          type="button"
          className={styles.eyeDropperBtn} 
          onClick={handleEyedropper} 
          title="Conta-gotas"
        >
          <Pipette size={14} />
        </button>
        <div className={styles.slidersCol}>
          <div 
            className={styles.hueSlider} 
            ref={hueRef}
            style={{ 
              touchAction: 'none',
              userSelect: 'none'
            }}
            onMouseDown={(e) => { 
              if (e.button !== 0) return;
              setIsDraggingHue(true); 
              handleHueChange(e); 
            }}
            onTouchStart={(e) => { 
              setIsDraggingHue(true); 
              handleHueChange(e); 
            }}
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
        {['r', 'g', 'b'].map((key) => (
          <div key={key} className={styles.inputGroup}>
            <input 
              value={rgb[key as keyof typeof rgb]} 
              onChange={e => handleRgbChange(key as 'r'|'g'|'b', e.target.value)}
              className={styles.numInput} 
              maxLength={3}
            />
            <label>{key.toUpperCase()}</label>
          </div>
        ))}
      </div>
    </div>
  );
}