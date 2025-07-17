import { Link, LinkProps } from '@tanstack/react-router';
import classNames from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { FiMaximize2 } from 'react-icons/fi';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { VscChromeMinimize } from 'react-icons/vsc';
import styles from './Card.module.scss';

type CardComponentProps = Readonly<{
  title: string;
  isMinimized?: boolean;
  setMinimized?: (value: boolean) => void;
  addLink?: LinkProps;
  onAdd?: () => void;
  editLink?: LinkProps;
  onEdit?: () => void;
  onReload?: () => void;
  isReloading?: boolean;
  children: ReactNode;
  className?: string;
}>;
export default function CardComponent({
  title,
  isMinimized,
  setMinimized,
  addLink,
  onAdd,
  editLink,
  onEdit,
  onReload,
  isReloading,
  children,
  className,
}: CardComponentProps) {
  const editButton = useMemo(() => {
    if (editLink && onEdit) throw new Error('editLink and onEdit cannot be both defined');

    const children = <HiPencilAlt />;

    if (editLink)
      return (
        <Link {...editLink} className={classNames(styles.action, styles.edit)} onClick={onEdit}>
          {children}
        </Link>
      );
    else if (onEdit)
      return (
        <button className={classNames(styles.action, styles.edit)} onClick={onEdit}>
          {children}
        </button>
      );
  }, [editLink, onEdit]);

  const addButton = useMemo(() => {
    if (addLink && onAdd) throw new Error('addLink and onAdd cannot be both defined');

    const children = <IoMdAddCircleOutline />;

    if (addLink)
      return (
        <Link {...addLink} className={classNames(styles.action, styles.edit)} onClick={onEdit}>
          {children}
        </Link>
      );
    else if (onAdd)
      return (
        <button className={classNames(styles.action, styles.edit)} onClick={onAdd}>
          {children}
        </button>
      );
  }, [addLink, onAdd]);

  return (
    <div className={classNames(styles.card, className)}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.actions}>
          {isMinimized !== undefined && setMinimized && (
            <button className={styles.action} onClick={() => setMinimized(!isMinimized)}>
              {React.createElement(isMinimized ? FiMaximize2 : VscChromeMinimize)}
            </button>
          )}
          {addButton}
          {/* {addLink && (
            <Link {...addLink} className={classNames(styles.action, styles.add)}>
              <IoMdAddCircleOutline />
            </Link>
          )} */}
          {editButton}
          {/* {editLink && (
            <Link {...editLink} className={classNames(styles.action, styles.edit)}>
              <HiPencilAlt />
            </Link>
          )} */}
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
