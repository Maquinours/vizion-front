import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { HiPencilAlt } from 'react-icons/hi';
import { Link, getRouteApi } from '@tanstack/react-router';
import { MdMailOutline } from 'react-icons/md';
import { FaArchive, FaFile, FaTrash } from 'react-icons/fa';
import { VirtualElement } from '@popperjs/core';
import FaqResponseDto from '../../../../../../../../utils/types/FaqResponseDto';
import styles from './ContextMenu.module.scss';

const routeApi = getRouteApi('/app/faq');

type AppViewFaqViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  faq: FaqResponseDto | undefined;
}>;
export default function AppViewFaqViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  faq,
}: AppViewFaqViewTableComponentContextMenuComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {faq && (
                <MenuList>
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && [
                    <MenuItem key={0}>
                      <Link
                        from={routeApi.id}
                        to="./update/$faqId"
                        params={(old) => ({ ...old, faqId: faq.id })}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                        <span className={styles.text}>Modifier</span>
                      </Link>
                    </MenuItem>,
                    <MenuItem key={1}>
                      <Link
                        from={routeApi.id}
                        to="./ged/$faqId"
                        params={(old) => ({ ...old, faqId: faq.id })}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaFile className={styles.icon} width={16} height={16} color="#16204E" />
                        <span className={styles.text}>Accéder à la GED</span>
                      </Link>
                    </MenuItem>,
                  ]}
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="./send-by-email/$faqId"
                      params={(old) => ({ ...old, faqId: faq.id })}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <MdMailOutline className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Envoyer par mail</span>
                    </Link>
                  </MenuItem>
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && [
                    <MenuItem key={0}>
                      <Link
                        from={routeApi.id}
                        to="./archive/$faqId"
                        params={(old) => ({ ...old, faqId: faq.id })}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaArchive className={styles.icon} width={16} height={16} color="#16204E" />
                        <span className={styles.text}>{faq.archived ? 'Désarchiver' : 'Archiver'}</span>
                      </Link>
                    </MenuItem>,
                    <MenuItem key={1}>
                      <Link
                        from={routeApi.id}
                        to="./delete/$faqId"
                        params={(old) => ({ ...old, faqId: faq.id })}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                        <span className={styles.text}>Supprimer</span>
                      </Link>
                    </MenuItem>,
                  ]}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
