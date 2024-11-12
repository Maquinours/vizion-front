import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import BusinessSubQuotationResponseDto from '../../../../../../../../../../utils/types/BusinessSubQuotationResponseDto';
import styles from './SubQuotationContextMenu.module.scss';

const routePath = '/app/businesses-rma/business/$businessId/quotation';

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
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="create-detail/$subquotationId"
                      params={{ subquotationId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Ajouter un produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="update-subquotation/$subquotationId"
                      params={{ subquotationId: item.id }}
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
                      to="delete-subquotation/$subquotationId"
                      params={{ subquotationId: item.id }}
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
