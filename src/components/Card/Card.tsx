import { ReactNode } from 'react';
import styles from './Card.module.scss';

type CommonCardProps = {
  title: string;
  children: ReactNode;
};
const CommonCard = ({ title, children }: CommonCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};

export default CommonCard;
