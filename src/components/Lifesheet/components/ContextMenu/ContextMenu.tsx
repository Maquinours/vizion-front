import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link, LinkProps } from '@tanstack/react-router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import LifeSheetResponseDto from '../../../../utils/types/LifeSheetResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import styles from './ContextMenu.module.scss';

// const routePath = '/app/businesses-rma/business/$businessId/arc';

type LifesheetComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: LifeSheetResponseDto | undefined;
  getDeleteLink?: (lifesheet: LifeSheetResponseDto) => LinkProps;
  onDeleteClick?: (lifesheet: LifeSheetResponseDto) => void;
}>;
export default function LifesheetComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
  getDeleteLink,
  onDeleteClick,
}: LifesheetComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const { data: user } = useAuthentifiedUserQuery();

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const deleteButton = (() => {
    if (getDeleteLink && onDeleteClick) throw new Error('getDeleteLink and onDeleteClick cannot be both defined');

    if (!item) return null;

    if (getDeleteLink)
      return (
        <Link {...getDeleteLink(item)} search replace resetScroll={false} preload="render" ignoreBlocker onClick={onClose}>
          <FaTrash width={16} height={16} color={'#16204E'} />
          <span>Supprimer</span>
        </Link>
      );
    else if (onDeleteClick)
      return (
        <button
          type="button"
          onClick={() => {
            onDeleteClick(item);
            onClose();
          }}
        >
          <FaTrash width={16} height={16} color={'#16204E'} />
          <span>Supprimer</span>
        </button>
      );
    else throw new Error('getDeleteLink or onDeleteClick must be defined');
  })();

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className="z-[9999]">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && <MenuList>{user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && <MenuItem>{deleteButton}</MenuItem>}</MenuList>}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
