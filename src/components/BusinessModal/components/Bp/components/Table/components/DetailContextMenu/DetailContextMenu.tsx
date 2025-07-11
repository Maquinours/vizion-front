import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import BusinessBpDetailsResponseDto from '../../../../../../../../utils/types/BusinessBpDetailsResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import styles from './DetailContextMenu.module.scss';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import { MdBusinessCenter } from 'react-icons/md';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');
// const routePath = '/app/businesses-rma/business/$businessId/bp';

type BusinessModalComponentBpComponentTableComponentDetailContextMenuComponentProps = Readonly<{
  business: BusinessResponseDto;
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessBpDetailsResponseDto | undefined;
  onUpdateDetailClick: (detail: BusinessBpDetailsResponseDto) => void;
  onAddSerialClick: (detail: BusinessBpDetailsResponseDto) => void;
  onDeleteDetailClick: (detail: BusinessBpDetailsResponseDto) => void;
  onCreateDetailRmaClick: (detail: BusinessBpDetailsResponseDto) => void;
}>;
export default function BusinessModalComponentBpComponentTableComponentDetailContextMenuComponent({
  business,
  anchorElement,
  setAnchorElement,
  item,
  onUpdateDetailClick,
  onAddSerialClick,
  onDeleteDetailClick,
  onCreateDetailRmaClick,
}: BusinessModalComponentBpComponentTableComponentDetailContextMenuComponentProps) {
  // const { businessId } = routeApi.useParams();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(business.id));

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
                        onUpdateDetailClick(item);
                        onClose();
                      }}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier le produit</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      onClick={() => {
                        onAddSerialClick(item);
                        onClose();
                      }}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Entrer numéro de série</span>
                    </button>
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
                      <span className={styles.text}>Supprimer le produit</span>
                    </button>
                  </MenuItem>
                  {business.state === BusinessState.FACTURE && (
                    <MenuItem>
                      <button
                        type="button"
                        onClick={() => {
                          onCreateDetailRmaClick(item);
                          onClose();
                        }}
                      >
                        <MdBusinessCenter width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Créér un RMA</span>
                      </button>
                    </MenuItem>
                  )}
                  {/* <MenuItem>
                    <Link
                      from={routePath}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier le produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="add-serial/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Entrer numéro de série</span>
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
                      onClick={onClose}
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer le produit</span>
                    </Link>
                  </MenuItem>
                  {business.state === BusinessState.FACTURE && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="create-detail-rma/$detailId"
                        params={{ detailId: item.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <MdBusinessCenter width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Créér un RMA</span>
                      </Link>
                    </MenuItem>
                  )} */}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
