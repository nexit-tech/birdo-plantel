import styles from './FinanceChart.module.css';

interface FinanceChartProps {
  income: number;
  expense: number;
}

export function FinanceChart({ income, expense }: FinanceChartProps) {
  const total = income + expense;
  const incomePercent = total === 0 ? 0 : (income / total) * 100;
  const expensePercent = total === 0 ? 0 : (expense / total) * 100;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Balanço do Mês</h3>
      
      <div className={styles.barContainer}>
        {income > 0 && (
          <div className={styles.barSegment} style={{ width: `${incomePercent}%`, backgroundColor: '#34C759' }} />
        )}
        {expense > 0 && (
          <div className={styles.barSegment} style={{ width: `${expensePercent}%`, backgroundColor: '#FF3B30' }} />
        )}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.dot} style={{ backgroundColor: '#34C759' }} />
          <span>Receita ({Math.round(incomePercent)}%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.dot} style={{ backgroundColor: '#FF3B30' }} />
          <span>Despesa ({Math.round(expensePercent)}%)</span>
        </div>
      </div>
    </div>
  );
}