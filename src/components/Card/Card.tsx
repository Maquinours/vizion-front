import React, { ReactNode } from 'react';
import styles from './Card.module.scss';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineReload } from 'react-icons/ai';
import { FiMaximize2 } from 'react-icons/fi';
import { VscChromeMinimize } from 'react-icons/vsc';
import classNames from 'classnames';
import { Link, LinkProps } from '@tanstack/react-router';
import { HiPencilAlt } from 'react-icons/hi';

type CardComponentProps = Readonly<{
  title: string;
  isMinimized?: boolean;
  setMinimized?: (value: boolean) => void;
  addLink?: LinkProps;
  editLink?: LinkProps;
  onReload?: () => void;
  isReloading?: boolean;
  children: ReactNode;
}>;
export default function CardComponent({ title, isMinimized, setMinimized, addLink, editLink, onReload, isReloading, children }: CardComponentProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          {isMinimized !== undefined && setMinimized && (
            <button className={styles.action} onClick={() => setMinimized(!isMinimized)}>
              {React.createElement(isMinimized ? FiMaximize2 : VscChromeMinimize)}
            </button>
          )}
          {addLink && (
            <Link {...addLink} className={classNames(styles.action, styles.add)}>
              <IoMdAddCircleOutline />
            </Link>
          )}
          {editLink && (
            <Link {...editLink} className={classNames(styles.action, styles.edit)}>
              <HiPencilAlt />
            </Link>
          )}
          {onReload && (
            <button className={classNames(styles.action, styles.reload, { [styles.spin]: isReloading })} onClick={onReload} disabled={isReloading}>
              <AiOutlineReload className="" />
            </button>
          )}
        </div>
      </div>
      {Boolean(!isMinimized) && children}
    </div>
  );
}
