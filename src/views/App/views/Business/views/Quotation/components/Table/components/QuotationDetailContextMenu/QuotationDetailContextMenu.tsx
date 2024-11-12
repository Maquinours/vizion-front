import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import BusinessQuotationDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import styles from './QuotationDetailContextMenu.module.scss';

const routePath = '/app/businesses-rma/business/$businessId/quotation';

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
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="create-associated-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Produits associés</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
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
