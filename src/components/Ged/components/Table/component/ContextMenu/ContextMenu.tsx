import { VirtualElement } from '@popperjs/core';
import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import FileDataTreeResponseDto from '../../../../../../utils/types/FileDataTreeResponseDto';
import { FiMail } from 'react-icons/fi';
import { FaFileImport, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import styles from './ContextMenu.module.scss';

type GedComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  selectedItem: FileDataTreeResponseDto | undefined;
  canMakeAction: boolean;
  openCreateDirectoryModal: (item?: FileDataTreeResponseDto) => void;
  openImportFilesModal: (item?: FileDataTreeResponseDto) => void;
  openRenameModal: (item: FileDataTreeResponseDto) => void;
  openDeleteModal: (item: FileDataTreeResponseDto) => void;
}>;

export default function GedComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  selectedItem,
  canMakeAction,
  openCreateDirectoryModal,
  openImportFilesModal,
  openRenameModal,
  openDeleteModal,
}: GedComponentTableComponentContextMenuComponentProps) {
  const { data: currentUser } = useAuthentifiedUserQuery();

  const isVizeoMember = currentUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO');
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              <MenuList>
                {isVizeoMember && canMakeAction && selectedItem?.dir === true && (
                  <MenuItem>
                    <FiMail className={styles.icon} />
                    <span className={styles.text}>Envoyer en PJ</span>
                  </MenuItem>
                )}
                {selectedItem?.dir === true && (
                  <MenuItem onClick={() => openCreateDirectoryModal(selectedItem)}>
                    <FaFileImport className={styles.icon} />
                    <span className={styles.text}>Nouveau dossier</span>
                  </MenuItem>
                )}
                <MenuItem onClick={() => openImportFilesModal(selectedItem)}>
                  <FaFileImport className={styles.icon} />
                  <span className={styles.text}>{selectedItem?.dir ? 'Importer un fichier' : 'Ajouter un fichier'}</span>
                </MenuItem>
                <MenuItem onClick={() => openRenameModal(selectedItem!)}>
                  <MdModeEdit className={styles.icon} />
                  <span className={styles.text}>Renommer le {selectedItem?.dir ? 'fichier' : 'dossier'}</span>
                </MenuItem>
                {isVizeoMember && (
                  <MenuItem onClick={() => openDeleteModal(selectedItem!)}>
                    <FaTrash className={styles.icon} />
                    <span className={styles.text}>Supprimer le {selectedItem?.dir ? 'dossier' : 'fichier'}</span>
                  </MenuItem>
                )}
              </MenuList>
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
