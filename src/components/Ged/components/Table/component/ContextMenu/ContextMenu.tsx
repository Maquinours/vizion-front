import { ClickAwayListener, Fade, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { useContext } from 'react';
import { FaFileImport, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import FileDataTreeResponseDto from '../../../../../../utils/types/FileDataTreeResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import { GedContext } from '../../../../utils/contexts/ged';
import GedComponentTableComponentContextMenuComponentItemComponent from './components/Item/Item';
import styles from './ContextMenu.module.scss';

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

  const {
    canMakeAction,
    getCreateDirectoryLink,
    onCreateDirectoryClick,
    getImportFilesLink,
    onImportFilesClick,
    getRenameLink,
    onRenameClick,
    getDeleteLink,
    onDeleteClick,
  } = useContext(GedContext)!;

  const isVizeoMember = currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO');
  const isOpen = Boolean(anchorElement) && canMakeAction;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
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
                  <GedComponentTableComponentContextMenuComponentItemComponent
                    link={getCreateDirectoryLink ? getCreateDirectoryLink(selectedItem) : undefined}
                    onClick={onCreateDirectoryClick ? () => onCreateDirectoryClick(selectedItem) : undefined}
                    onClose={onClose}
                    show={selectedItem?.dir !== true}
                  >
                    <FaFileImport className={styles.icon} />
                    <span className={styles.text}>Nouveau dossier</span>
                  </GedComponentTableComponentContextMenuComponentItemComponent>
                  {/* {selectedItem?.dir === true && (
                    <MenuItem>
                      <Link {...getCreateDirectoryLink(selectedItem)} preload="render" onClick={onClose}>
                        <FaFileImport className={styles.icon} />
                        <span className={styles.text}>Nouveau dossier</span>
                      </Link>
                    </MenuItem>
                  )} */}
                  <GedComponentTableComponentContextMenuComponentItemComponent
                    link={getImportFilesLink ? getImportFilesLink(selectedItem) : undefined}
                    onClick={onImportFilesClick ? () => onImportFilesClick(selectedItem) : undefined}
                    onClose={onClose}
                    show
                  >
                    <FaFileImport className={styles.icon} />
                    <span className={styles.text}>{selectedItem?.dir ? 'Importer un fichier' : 'Ajouter un fichier'}</span>
                  </GedComponentTableComponentContextMenuComponentItemComponent>
                  {/* <MenuItem>
                    <Link {...getImportFilesLink(selectedItem)} preload="render" onClick={onClose}>
                      <FaFileImport className={styles.icon} />
                      <span className={styles.text}>{selectedItem?.dir ? 'Importer un fichier' : 'Ajouter un fichier'}</span>
                    </Link>
                  </MenuItem> */}
                  <GedComponentTableComponentContextMenuComponentItemComponent
                    link={getRenameLink ? getRenameLink(selectedItem) : undefined}
                    onClick={onRenameClick ? () => onRenameClick(selectedItem) : undefined}
                    onClose={onClose}
                    show
                  >
                    <MdModeEdit className={styles.icon} />
                    <span className={styles.text}>Renommer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
                  </GedComponentTableComponentContextMenuComponentItemComponent>
                  {/* <MenuItem>
                    <Link {...getRenameLink(selectedItem)} preload="render" onClick={onClose}>
                      <MdModeEdit className={styles.icon} />
                      <span className={styles.text}>Renommer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
                    </Link>
                  </MenuItem> */}
                  <GedComponentTableComponentContextMenuComponentItemComponent
                    link={getDeleteLink ? getDeleteLink(selectedItem) : undefined}
                    onClick={onDeleteClick ? () => onDeleteClick(selectedItem) : undefined}
                    onClose={onClose}
                    show={isVizeoMember}
                  >
                    <FaTrash className={styles.icon} />
                    <span className={styles.text}>Supprimer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
                  </GedComponentTableComponentContextMenuComponentItemComponent>
                  {/* {isVizeoMember && (
                    <MenuItem>
                      <Link {...getDeleteLink(selectedItem)} preload="render" onClick={onClose}>
                        <FaTrash className={styles.icon} />
                        <span className={styles.text}>Supprimer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
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
