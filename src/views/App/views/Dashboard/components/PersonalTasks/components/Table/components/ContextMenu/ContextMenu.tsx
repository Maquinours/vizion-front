import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link, getRouteApi } from '@tanstack/react-router';
import { BsEyeFill, BsFillCircleFill, BsLink45Deg } from 'react-icons/bs';
import { IoMdArrowForward } from 'react-icons/io';
import { MdOutlineComment, MdSchedule } from 'react-icons/md';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import ProfileInfoResponseDto from '../../../../../../../../../../utils/types/ProfileInfoResponseDto';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';
import styles from './ContextMenu.module.scss';

const Route = getRouteApi('/app/dashboard');

type AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponentProps = Readonly<{
  anchor: VirtualElement | undefined;
  setAnchor: (anchor: VirtualElement | undefined) => void;
  task: TaskResponseDto | undefined;
  user: ProfileInfoResponseDto;
}>;
export default function AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponent({
  anchor,
  setAnchor,
  task,
  user,
}: AppViewDashboardViewPersonalTasksComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchor);

  return (
    <Popper open={isOpen} anchorEl={anchor} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={() => setAnchor(undefined)}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {task && (
                <MenuList>
                  {!task.businessId && !task.enterpriseId && !task.productId && !task.rmaId && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./link-personal-task/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                        preload="viewport"
                      >
                        <BsLink45Deg className={styles.icon} /> <span className={styles.text}>Relier à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {((task.profileId === user.profile.id && task.state !== TaskState.ARCHIVED) ||
                    (task.senderId === user.profile.id && task.senderState !== TaskState.ARCHIVED)) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./archive-personal-task/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                        preload="viewport"
                      >
                        <BsFillCircleFill className={styles.icon} color="#5DC896" />
                        <span className={styles.text}>Archiver</span>
                      </Link>
                    </MenuItem>
                  )}
                  {((task.profileId === user.profile.id && [TaskState.CLOSED, TaskState.CREATED].includes(task.state!)) ||
                    (task.senderId === user.profile.id && [TaskState.CLOSED, TaskState.CREATED].includes(task.senderState!))) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./update-personal-task-deadline/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                        preload="viewport"
                      >
                        <MdSchedule className={styles.icon} />
                        <span className={styles.text}>Repousser</span>
                      </Link>
                    </MenuItem>
                  )}
                  {((task.profileId === user.profile.id && task.state === TaskState.CREATED) ||
                    (task.senderId === user.profile.id && task.senderState === TaskState.CREATED)) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./transfer-task/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                        preload="viewport"
                      >
                        <IoMdArrowForward className={styles.icon} />
                        <span className={styles.text}>Transférer à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {((task.profileId === user.profile.id && task.state === TaskState.CREATED) ||
                    (task.senderId === user.profile.id && task.senderState === TaskState.CREATED)) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./validate-personal-task/$taskId"
                        params={{ taskId: task.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                        preload="viewport"
                      >
                        <BsFillCircleFill className={styles.icon} color="#31385A" />
                        <span className={styles.text}>En attente</span>
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <Link
                      from={Route.id}
                      to="./personal-task-details/$taskId"
                      params={{ taskId: task.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
                      <BsEyeFill className={styles.icon} />
                      <span className={styles.text}>Ouvrir</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={Route.id}
                      to="./task-comments/$taskId"
                      params={{ taskId: task.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="viewport"
                    >
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
