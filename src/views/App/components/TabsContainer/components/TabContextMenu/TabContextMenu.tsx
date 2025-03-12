import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Tab } from '../../TabsContainer';
import AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponent from './components/BusinessItems/BusinessItems';
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
    onClose();
    removeTabs(tabs.filter((tab) => tab.id !== selectedItem?.id && tab.closable !== false));
  };

  const onCloseAllTabs = () => {
    onClose();
    removeTabs(tabs.filter((tab) => tab.closable !== false));
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className="z-999">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {!!selectedItem && (
                <MenuList>
                  <MenuItem onClick={onCloseOtherTabs}>
                    <span className={styles.text}>Fermer les autres onglets</span>
                  </MenuItem>
                  <MenuItem onClick={onCloseAllTabs}>
                    <span className={styles.text}>Fermer tous les onglets</span>
                  </MenuItem>
                  {selectedItem.route.to?.startsWith('/app/businesses-rma/business/$businessId') &&
                    typeof selectedItem.route.params === 'object' &&
                    'businessId' in selectedItem.route.params &&
                    selectedItem.route.params.businessId !== undefined && (
                      <AppViewTabsContainerComponentTabContextMenuComponentBusinessItemsComponent businessId={selectedItem.route.params.businessId} />
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
