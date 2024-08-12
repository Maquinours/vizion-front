import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import styles from './ContextMenu.module.scss';
import { BsEyeFill, BsFillCircleFill, BsLink45Deg } from 'react-icons/bs';
import { MdOutlineComment, MdSchedule } from 'react-icons/md';
import { IoMdArrowForward } from 'react-icons/io';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';
import { Link, getRouteApi } from '@tanstack/react-router';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

type AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponentProps = Readonly<{
  anchor: VirtualElement | undefined;
  setAnchor: (anchor: VirtualElement | undefined) => void;
  task: TaskResponseDto | undefined;
}>;
export default function AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponent({
  anchor,
  setAnchor,
  task,
}: AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchor);

  const { data: currentUser } = useAuthentifiedUserQuery();

  return (
    <Popper open={isOpen} anchorEl={anchor} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={() => setAnchor(undefined)}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {task && (
                <MenuList>
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && !task.businessId && !task.enterpriseId && !task.productId && !task.rmaId && (
                    <MenuItem>
                      <Link from={Route.id} to="../../link-personal-task/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
                        <BsLink45Deg className={styles.icon} /> <span className={styles.text}>Relier à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && task.state !== TaskState.ARCHIVED && (
                    <MenuItem>
                      <Link from={Route.id} to="../../archive-personal-task/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
                        <BsFillCircleFill className={styles.icon} color="#5DC896" />
                        <span className={styles.text}>Archiver</span>
                      </Link>
                    </MenuItem>
                  )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && [TaskState.CLOSED, TaskState.CREATED].includes(task.state!) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="../../update-personal-task-deadline/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        preload="viewport"
                      >
                        <MdSchedule className={styles.icon} />
                        <span className={styles.text}>Repousser</span>
                      </Link>
                    </MenuItem>
                  )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && task.state === TaskState.CREATED && (
                    <MenuItem>
                      <Link from={Route.id} to="../../transfer-task/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
                        <IoMdArrowForward className={styles.icon} />
                        <span className={styles.text}>Transférer à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && task.state === TaskState.CREATED && (
                    <MenuItem>
                      <Link from={Route.id} to="../../validate-personal-task/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
                        <BsFillCircleFill className={styles.icon} color="#31385A" />
                        <span className={styles.text}>En attente</span>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <Link from={Route.id} to="../../personal-task-details/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
                      <BsEyeFill className={styles.icon} />
                      <span className={styles.text}>Ouvrir</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={Route.id} to="../../task-comments/$taskId" params={{ taskId: task.id }} search={(old) => old} preload="viewport">
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
