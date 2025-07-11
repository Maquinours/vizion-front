import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import BusinessSubQuotationResponseDto from '../../../../../../../../utils/types/BusinessSubQuotationResponseDto';
import styles from './SubQuotationContextMenu.module.scss';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

// const routePath = '/app/businesses-rma/business/$businessId/quotation';

type BusinessModalComponentQuotationComponentTableComponentSubQuotationContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessSubQuotationResponseDto | undefined;
  onCreateDetailClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
  onUpdateSubQuotationClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
  onDeleteSubQuotationClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
}>;
export default function BusinessModalComponentQuotationComponentTableComponentSubQuotationContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
  onCreateDetailClick,
  onUpdateSubQuotationClick,
  onDeleteSubQuotationClick,
}: BusinessModalComponentQuotationComponentTableComponentSubQuotationContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className="z-[9999]">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onCreateDetailClick(item);
                        onClose();
                      }}
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Ajouter un produit</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateSubQuotationClick(item);
                        onClose();
                      }}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSubQuotationClick(item);
                        onClose();
                      }}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </button>
                  </MenuItem>
                  {/* <MenuItem>
                    <Link
                      from={routePath}
                      to="create-detail/$subquotationId"
                      params={{ subquotationId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
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
                      onClick={onClose}
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
                      onClick={onClose}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </Link>
                  </MenuItem> */}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
