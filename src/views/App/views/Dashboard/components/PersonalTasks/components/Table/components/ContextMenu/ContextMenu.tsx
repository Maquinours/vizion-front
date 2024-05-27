import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import styles from './ContextMenu.module.scss';
import { BsEyeFill, BsFillCircleFill, BsLink45Deg } from 'react-icons/bs';
import { MdOutlineComment, MdSchedule } from 'react-icons/md';
import { IoMdArrowForward } from 'react-icons/io';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';
import { Link, getRouteApi } from '@tanstack/react-router';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';

const Route = getRouteApi('/app/dashboard');

type AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponentProps = Readonly<{
  anchor: VirtualElement | undefined;
  setAnchor: (anchor: VirtualElement | undefined) => void;
  task: TaskResponseDto | undefined;
}>;
export default function AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponent({
  anchor,
  setAnchor,
  task,
}: AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchor);

  return (
    <Popper open={isOpen} anchorEl={anchor} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={() => setAnchor(undefined)}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {task && (
                <MenuList>
                  {!task.businessId && !task.enterpriseId && !task.productId && !task.rmaId && (
                    <MenuItem>
                      <Link from={Route.id} to="./link-personal-task/$taskId" params={{ taskId: task.id }} search={(old) => old} replace resetScroll={false}>
                        <BsLink45Deg className={styles.icon} /> <span className={styles.text}>Relier à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {task.state !== TaskState.ARCHIVED && (
                    <MenuItem>
                      <Link from={Route.id} to="./archive-personal-task/$taskId" params={{ taskId: task.id }} search={(old) => old} replace resetScroll={false}>
                        <BsFillCircleFill className={styles.icon} color="#5DC896" />
                        <span className={styles.text}>Archiver</span>
                      </Link>
                    </MenuItem>
                  )}
                  {[(TaskState.CLOSED, TaskState.CREATED)].includes(task.state!) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./update-personal-task-deadline/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <MdSchedule className={styles.icon} />
                        <span className={styles.text}>Repousser</span>
                      </Link>
                    </MenuItem>
                  )}
                  {![TaskState.CLOSED, TaskState.ARCHIVED].includes(task.state!) && (
                    <MenuItem>
                      <Link from={Route.id} to="./transfer-task/$taskId" params={{ taskId: task.id }} search={(old) => old} replace resetScroll={false}>
                        <IoMdArrowForward className={styles.icon} />
                        <span className={styles.text}>Transférer à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {![TaskState.CLOSED, TaskState.ARCHIVED].includes(task.state!) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./validate-personal-task/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <BsFillCircleFill className={styles.icon} color="#31385A" />
                        <span className={styles.text}>En attente</span>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <Link from={Route.id} to="./personal-task-details/$taskId" params={{ taskId: task.id }} search={(old) => old} replace resetScroll={false}>
                      <BsEyeFill className={styles.icon} />
                      <span className={styles.text}>Ouvrir</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={Route.id} to="./task-comments/$taskId" params={{ taskId: task.id }} search={(old) => old} replace resetScroll={false}>
                      <MdOutlineComment className={styles.icon} />
                      <span className={styles.text}>Commentaires</span>
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
