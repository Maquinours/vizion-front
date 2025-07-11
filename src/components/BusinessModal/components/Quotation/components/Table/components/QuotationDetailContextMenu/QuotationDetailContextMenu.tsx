import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import BusinessQuotationDetailsResponseDto from '../../../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import styles from './QuotationDetailContextMenu.module.scss';

// const routePath = '/app/businesses-rma/business/$businessId/quotation';

type BusinessModalComponentQuotationComponentTableComponentQuotationDetailContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessQuotationDetailsResponseDto | undefined;
  onCreateAssociatedDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
  onUpdateDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
  onDeleteDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
}>;
export default function BusinessModalComponentQuotationComponentTableComponentQuotationDetailContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
  onCreateAssociatedDetailClick,
  onUpdateDetailClick,
  onDeleteDetailClick,
}: BusinessModalComponentQuotationComponentTableComponentQuotationDetailContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  console.log({ anchorElement, setAnchorElement, item });

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
                        onCreateAssociatedDetailClick(item);
                        onClose();
                      }}
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Produits associés</span>
                    </button>
                    {/* <Link
                      from={routePath}
                      to="create-associated-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
                    >
                      <IoMdAddCircleOutline width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Produits associés</span>
                    </Link> */}
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateDetailClick(item);
                        onClose();
                      }}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </button>
                    {/* <Link
                      from={routePath}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </Link> */}
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteDetailClick(item);
                        onClose();
                      }}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </button>
                    {/* <Link
                      from={routePath}
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      ignoreBlocker
                      onClick={onClose}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </Link> */}
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
