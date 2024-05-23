import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { MdBusinessCenter } from 'react-icons/md';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../../../utils/enums/BusinessState';
import styles from './DetailContextMenu.module.scss';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import BusinessBpDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessBpDetailsResponseDto';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp');

type AppViewBusinessViewBpViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessBpDetailsResponseDto | undefined;
}>;
export default function AppViewBusinessViewBpViewTableComponentDetailContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewBusinessViewBpViewTableComponentContextMenuComponentProps) {
  const { businessId } = routeApi.useParams();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

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
                    <Link from={routeApi.id} to="update-detail/$detailId" params={{ detailId: item.id }} search={(old) => old} replace>
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Modifier le produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="add-serial/$detailId" params={{ detailId: item.id }} search={(old) => old} replace>
                      <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Entrer numéro de série</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="delete-detail/$detailId" params={{ detailId: item.id }} search={(old) => old} replace>
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer le produit</span>
                    </Link>
                  </MenuItem>
                  {business.state === BusinessState.FACTURE && (
                    <MenuItem>
                      <Link from={routeApi.id} to="create-detail-rma/$detailId" params={{ detailId: item.id }} search={(old) => old} replace>
                        <MdBusinessCenter width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Créér un RMA</span>
                      </Link>
                    </MenuItem>
                  )}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
