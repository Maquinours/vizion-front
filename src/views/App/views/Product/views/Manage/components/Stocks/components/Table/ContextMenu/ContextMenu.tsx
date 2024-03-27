import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { MdOutlineInventory } from 'react-icons/md';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import ProductVersionShelfStockResponseDto from '../../../../../../../../../../../utils/types/ProductVersionShelfStockResponseDto';
import styles from './ContextMenu.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/products/$productId/manage');

type AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  stock: ProductVersionShelfStockResponseDto | undefined;
}>;
export default function AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  stock,
}: AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {stock && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="./stock-history/$stockId"
                      params={(old) => ({ ...old, stockId: stock.id })}
                      search={(old) => ({ ...old, stockHistoryPage: 0 })}
                    >
                      <MdOutlineInventory className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Historique du stock</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="./delete-stock/$stockId" params={(old) => ({ ...old, stockId: stock.id })} search={(old) => old}>
                      <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Supprimer le stock</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="./update-stock/$stockId" params={(old) => ({ ...old, stockId: stock.id })} search={(old) => old}>
                      <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Modifier le stock</span>
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
