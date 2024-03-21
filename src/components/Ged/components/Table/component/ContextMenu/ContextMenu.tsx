import { VirtualElement } from '@popperjs/core';
import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import FileDataTreeResponseDto from '../../../../../../utils/types/FileDataTreeResponseDto';
import { FaFileImport, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import styles from './ContextMenu.module.scss';
import { useContext } from 'react';
import { GedContext } from '../../../../utils/contexts/ged';
import { Link } from '@tanstack/react-router';

type GedComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  selectedItem: FileDataTreeResponseDto | undefined;
}>;

export default function GedComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  selectedItem,
}: GedComponentTableComponentContextMenuComponentProps) {
  const { data: currentUser } = useAuthentifiedUserQuery();

  const { canMakeAction, getCreateDirectoryLink, getImportFilesLink, getRenameLink, getDeleteLink } = useContext(GedContext)!;

  const isVizeoMember = currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO');
  const isOpen = Boolean(anchorElement) && canMakeAction;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {selectedItem && (
                <MenuList>
                  {/* {isVizeoMember && selectedItem?.dir === true && (
                    <MenuItem>
                      <FiMail className={styles.icon} />
                      <span className={styles.text}>Envoyer en PJ</span>
                    </MenuItem>
                  )} */}
                  {selectedItem?.dir === true && (
                    <MenuItem>
                      <Link {...getCreateDirectoryLink(selectedItem)}>
                        <FaFileImport className={styles.icon} />
                        <span className={styles.text}>Nouveau dossier</span>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <Link {...getImportFilesLink(selectedItem)}>
                      <FaFileImport className={styles.icon} />
                      <span className={styles.text}>{selectedItem?.dir ? 'Importer un fichier' : 'Ajouter un fichier'}</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link {...getRenameLink(selectedItem)}>
                      <MdModeEdit className={styles.icon} />
                      <span className={styles.text}>Renommer le {selectedItem?.dir ? 'fichier' : 'dossier'}</span>
                    </Link>
                  </MenuItem>
                  {isVizeoMember && (
                    <MenuItem>
                      <Link {...getDeleteLink(selectedItem)}>
                        <FaTrash className={styles.icon} />
                        <span className={styles.text}>Supprimer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
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
