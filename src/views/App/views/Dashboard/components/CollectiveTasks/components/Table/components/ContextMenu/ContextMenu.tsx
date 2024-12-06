import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { FaTrash } from 'react-icons/fa';
import { IoIosCheckmarkCircleOutline, IoMdArrowForward } from 'react-icons/io';
import { MdOutlineComment } from 'react-icons/md';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';
import styles from './ContextMenu.module.scss';

const routePath = '/app/dashboard';

type AppViewDashboardViewCollectiveTasksComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: (value: VirtualElement | undefined) => void;
  task: TaskResponseDto | undefined;
}>;
export default function AppViewDashboardViewCollectiveTasksComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  task,
}: AppViewDashboardViewCollectiveTasksComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {task && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="take-collective-task/$taskId"
                      params={{ taskId: task.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <IoIosCheckmarkCircleOutline className={styles.icon} />
                      <span className={styles.text}>Je prends en charge</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="transfer-task/$taskId"
                      params={{ taskId: task.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <IoMdArrowForward className={styles.icon} />
                      <span className={styles.text}>Transférer</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="task-comments/$taskId"
                      params={{ taskId: task.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <MdOutlineComment className={styles.icon} />
                      <span className={styles.text}>Commentaires</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="delete-collective-task/$taskId"
                      params={{ taskId: task.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <FaTrash className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
                    </Link>
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
