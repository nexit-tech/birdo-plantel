import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '@/types';
import clsx from 'clsx';
import styles from './TransactionRow.module.css';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'RECEITA';

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={clsx(styles.iconBox, isIncome ? styles.incomeIcon : styles.expenseIcon)}>
          {isIncome ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{transaction.category}</span>
          <span className={styles.description}>{transaction.description}</span>
          <span className={styles.date}>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={clsx(styles.amount, isIncome ? styles.incomeText : styles.expenseText)}>
          {isIncome ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
        </span>
        <div className={styles.actions}>
           <button onClick={onEdit} className={styles.actionBtn}><Edit2 size={16} /></button>
           <button onClick={onDelete} className={styles.actionBtn}><Trash2 size={16} /></button>
        </div>
      </div>
    </div>
  );
}