'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MONTHS, WEEKDAYS, getDaysInMonth, getFirstDayOfMonth, getYearsRange, formatDate } from '@/utils/date';
import clsx from 'clsx';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

type ViewMode = 'CALENDAR' | 'MONTHS' | 'YEARS';

export function DatePicker({ label, value, onChange, placeholder }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('CALENDAR');
  
  const cleanValue = value ? value.split('T')[0] : '';

  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());

  useEffect(() => {
    if (cleanValue) {
      const [y, m, d] = cleanValue.split('-').map(Number);
      if (y && m && d) {
        setDisplayYear(y);
        setDisplayMonth(m - 1);
      }
    }
  }, [cleanValue, isOpen]);

  const handleDaySelect = (day: number) => {
    const formattedMonth = String(displayMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${displayYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setDisplayMonth(monthIndex);
    setViewMode('CALENDAR');
  };

  const handleYearSelect = (year: number) => {
    setDisplayYear(year);
    setViewMode('MONTHS'); 
  };

  const changeMonth = (offset: number) => {
    let newMonth = displayMonth + offset;
    let newYear = displayYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setDisplayMonth(newMonth);
    setDisplayYear(newYear);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isSelected = cleanValue === currentDateStr;

      days.push(
        <button
          key={i}
          type="button"
          onClick={() => handleDaySelect(i)}
          className={clsx(styles.dayBtn, isSelected && styles.selectedDay)}
        >
          {i}
        </button>
      );
    }

    return (
      <>
        <div className={styles.weekdays}>
          {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className={styles.daysGrid}>{days}</div>
      </>
    );
  };

  const renderMonths = () => (
    <div className={styles.monthsGrid}>
      {MONTHS.map((m, idx) => (
        <button
          key={m}
          type="button"
          onClick={() => handleMonthSelect(idx)}
          className={clsx(styles.monthBtn, idx === displayMonth && styles.selectedOption)}
        >
          {m.substring(0, 3)}
        </button>
      ))}
    </div>
  );

  const renderYears = () => (
    <div className={styles.yearsList}>
      {getYearsRange(new Date().getFullYear()).map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => handleYearSelect(y)}
          className={clsx(styles.yearBtn, y === displayYear && styles.selectedOption)}
        >
          {y}
        </button>
      ))}
    </div>
  );

  const displayValue = cleanValue ? formatDate(cleanValue) : (placeholder || 'Selecione');

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.inputTrigger} onClick={() => setIsOpen(true)}>
        <CalendarIcon size={20} className={styles.icon} />
        <span className={clsx(styles.valueText, !cleanValue && styles.placeholder)}>
          {displayValue}
        </span>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}>
          <div className={styles.modal}>
            <div className={styles.header}>
              {viewMode === 'CALENDAR' && (
                <button type="button" onClick={() => changeMonth(-1)} className={styles.navBtn}>
                  <ChevronLeft size={20} />
                </button>
              )}
              
              <button 
                type="button" 
                className={styles.titleBtn}
                onClick={() => setViewMode(viewMode === 'CALENDAR' ? 'YEARS' : 'CALENDAR')}
              >
                {viewMode === 'CALENDAR' 
                  ? `${MONTHS[displayMonth]} ${displayYear}` 
                  : viewMode === 'YEARS' ? 'Selecione o Ano' : 'Selecione o Mês'}
              </button>

              {viewMode === 'CALENDAR' ? (
                <button type="button" onClick={() => changeMonth(1)} className={styles.navBtn}>
                  <ChevronRight size={20} />
                </button>
              ) : (
                 <button type="button" onClick={() => setIsOpen(false)} className={styles.navBtn}>
                  <X size={20} />
                </button>
              )}
            </div>

            <div className={styles.body}>
              {viewMode === 'CALENDAR' && renderCalendar()}
              {viewMode === 'MONTHS' && renderMonths()}
              {viewMode === 'YEARS' && renderYears()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}