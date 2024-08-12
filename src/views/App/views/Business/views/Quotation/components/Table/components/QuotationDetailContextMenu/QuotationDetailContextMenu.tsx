import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import BusinessQuotationDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import styles from './QuotationDetailContextMenu.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

type AppViewBusinessViewQuotationViewTableComponentQuotationDetailContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessQuotationDetailsResponseDto | undefined;
}>;
export default function AppViewBusinessViewQuotationViewTableComponentQuotationDetailContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewBusinessViewQuotationViewTableComponentQuotationDetailContextMenuComponentProps) {
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
                      to="create-associated-detail/$detailId"
                      params={{ detailId: item.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Produits associés</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
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
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
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
