import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Tab } from '../../TabsContainer';
import styles from './TabContextMenu.module.scss';

type AppViewTabsContainerComponentTabContextMenuComponentProps = Readonly<{
  tabs: Array<Tab>;
  removeTabs: (tabs: Array<Tab>) => void;
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  selectedItem: Tab | undefined;
}>;
export default function AppViewTabsContainerComponentTabContextMenuComponent({
  tabs,
  removeTabs,
  anchorElement,
  setAnchorElement,
  selectedItem,
}: AppViewTabsContainerComponentTabContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const onCloseOtherTabs = () => {
    removeTabs(tabs.filter((tab) => tab.id !== selectedItem?.id && tab.closable !== false && !tab.closeRoute));
    onClose();
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className="z-[999]">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {selectedItem && (
                <MenuList>
                  <MenuItem onClick={onCloseOtherTabs}>
                    <span className={styles.text}>Fermer les autres onglets</span>
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
