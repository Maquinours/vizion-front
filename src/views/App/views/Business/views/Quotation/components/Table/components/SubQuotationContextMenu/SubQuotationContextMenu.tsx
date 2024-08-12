import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import styles from './SubQuotationContextMenu.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import { VirtualElement } from '@popperjs/core';
import BusinessSubQuotationResponseDto from '../../../../../../../../../../utils/types/BusinessSubQuotationResponseDto';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

type AppViewBusinessViewQuotationViewTableComponentSubQuotationContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessSubQuotationResponseDto | undefined;
}>;
export default function AppViewBusinessViewQuotationViewTableComponentSubQuotationContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewBusinessViewQuotationViewTableComponentSubQuotationContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="create-detail/$subquotationId"
                      params={{ subquotationId: item.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Ajouter un produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="update-subquotation/$subquotationId"
                      params={{ subquotationId: item.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="delete-subquotation/$subquotationId"
                      params={{ subquotationId: item.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
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
