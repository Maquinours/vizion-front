import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import BusinessBpSerialResponseDto from '../../../../../../../../../../utils/types/BusinessBpSerialResponseDto';
import { FiCopy } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import styles from './SerialContextMenu.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import BusinessState from '../../../../../../../../../../utils/enums/BusinessState';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp');

type AppViewBusinessViewBpViewTableComponentSerialContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessBpSerialResponseDto | undefined;
}>;
export default function AppViewBusinessViewBpViewTableComponentSerialContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewBusinessViewBpViewTableComponentSerialContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const onCopy = (item: BusinessBpSerialResponseDto) => {
    navigator.clipboard
      .writeText(item.numSerie)
      .then(() => {
        toast.success('Numéro de série copié avec succès.');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Une erreur est survenue lors de la copie du numéro de série.');
      });
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
                    <button onClick={() => onCopy(item)}>
                      <FiCopy width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Copier</span>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="delete-serial/$serialId" params={{ serialId: item.id }} search={(old) => old}>
                      <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </Link>
                  </MenuItem>
                  {[BusinessState.FACTURE, BusinessState.BP].includes(business.state!) && (
                    <MenuItem>
                      <Link from={routeApi.id} to="create-serial-rma/$serialId" params={{ serialId: item.id }} search={(old) => old}>
                        <MdBusinessCenter width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Créer un RMA</span>
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
