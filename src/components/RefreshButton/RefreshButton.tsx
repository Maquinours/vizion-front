import classNames from 'classnames';
import React from 'react';
import { MdRefresh } from 'react-icons/md';
import styles from './RefreshButton.module.scss';

type RefreshButtonComponentProps = Readonly<{
  onRefresh: () => void;
  isRefreshing: boolean;
  style?: React.CSSProperties;
  className?: string;
}>;
export default function RefreshButtonComponent({ onRefresh, isRefreshing, style, className }: RefreshButtonComponentProps) {
  return (
    <button className={className} style={style} onClick={onRefresh} disabled={isRefreshing}>
      <MdRefresh className={classNames({ [styles.spin]: isRefreshing })} />
    </button>
  );
}
