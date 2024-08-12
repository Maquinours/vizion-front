import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { Link, getRouteApi } from '@tanstack/react-router';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import AdvancedProductSpecificationProductResponseDto from '../../../../../../../../../../../utils/types/AdvancedProductSpecificationProductResponseDto';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage');

type AppViewProductViewManageViewSpecificationsComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  productSpecification: AdvancedProductSpecificationProductResponseDto | undefined;
}>;
export default function AppViewProductViewManageViewSpecificationsComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  productSpecification,
}: AppViewProductViewManageViewSpecificationsComponentTableComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {productSpecification?.specification && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="update-specification/$specificationId"
                      params={{ specificationId: productSpecification.specification!.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Modifier la spécification</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="delete-specification/$specificationId"
                      params={{ specificationId: productSpecification.specification!.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Supprimer la spécification</span>
                    </Link>
                  </MenuItem>
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
