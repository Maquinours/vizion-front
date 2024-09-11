import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import ProductBomDetailsResponseDto from '../../../../../../../../../../utils/types/ProductBomDetailsResponseDto';
import styles from './ContextMenu.module.scss';
import { getRouteApi, Link } from '@tanstack/react-router';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

const routeApi = getRouteApi('/app/products/$productId/manage');

type AppViewProductViewManageViewNomenclatureComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  onClose: () => void;
  item: ProductBomDetailsResponseDto | undefined;
}>;
export default function AppViewProductViewManageViewNomenclatureComponentContextMenuComponent({
  anchorElement,
  onClose,
  item,
}: AppViewProductViewManageViewNomenclatureComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {!!item && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="update-nomenclature-detail/$nomenclatureDetailId"
                      params={{ nomenclatureDetailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="delete-nomenclature-detail/$nomenclatureDetailId"
                      params={{ nomenclatureDetailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Supprimer</span>
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
