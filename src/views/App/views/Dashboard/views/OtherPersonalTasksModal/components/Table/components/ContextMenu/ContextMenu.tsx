import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { BsEyeFill, BsFillCircleFill, BsLink45Deg } from 'react-icons/bs';
import { GoUnlink } from 'react-icons/go';
import { IoMdArrowForward } from 'react-icons/io';
import { MdOutlineComment, MdSchedule } from 'react-icons/md';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ContextMenu.module.scss';

const routePath = '/app/dashboard/other-personal-tasks/$profileId';

type AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponentProps = Readonly<{
  anchor: VirtualElement | undefined;
  setAnchor: (anchor: VirtualElement | undefined) => void;
  task: TaskResponseDto | undefined;
  profile: ProfileResponseDto;
}>;
export default function AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponent({
  anchor,
  setAnchor,
  task,
  profile,
}: AppViewDashboardViewOtherPersonalTasksModalViewTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchor);

  const { data: currentUser } = useAuthentifiedUserQuery();

  const onClose = () => {
    setAnchor(undefined);
  };

  const hasLink = !!task?.businessId || !!task?.enterpriseId || !!task?.productId || !!task?.rmaId;

  return (
    <Popper open={isOpen} anchorEl={anchor} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {task && (
                <MenuList>
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && !hasLink && (
                    <MenuItem>
                      <Link from={routePath} to="../../link-personal-task/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                        <BsLink45Deg className={styles.icon} /> <span className={styles.text}>Relier à</span>
                      </Link>
                    </MenuItem>
                  )}
                  {((currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') &&
                    [task.state, task.senderState].some((task) => task !== TaskState.ARCHIVED)) ||
                    (task.profileId === profile.id && task.state !== TaskState.ARCHIVED) ||
                    (task.senderId === profile.id && task.senderState !== TaskState.ARCHIVED)) && (
                    <MenuItem>
                      <Link from={routePath} to="../../archive-personal-task/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                        <BsFillCircleFill className={styles.icon} color="#5DC896" />
                        <span className={styles.text}>Archiver</span>
                      </Link>
                    </MenuItem>
                  )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') &&
                    ((task.profileId === profile.id && [TaskState.CLOSED, TaskState.CREATED].includes(task.state!)) ||
                      (task.senderId === profile.id && [TaskState.CLOSED, TaskState.CREATED].includes(task.senderState!))) && (
                      <MenuItem>
                        <Link
                          from={routePath}
                          to="../../update-personal-task-deadline/$taskId"
                          params={{ taskId: task.id }}
                          search
                          preload="render"
                          onClick={onClose}
                        >
                          <MdSchedule className={styles.icon} />
                          <span className={styles.text}>Repousser</span>
                        </Link>
                      </MenuItem>
                    )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') &&
                    ((task.profileId === profile.id && task.state === TaskState.CREATED) ||
                      (task.senderId === profile.id && task.senderState === TaskState.CREATED)) && (
                      <MenuItem>
                        <Link from={routePath} to="../../transfer-task/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                          <IoMdArrowForward className={styles.icon} />
                          <span className={styles.text}>Transférer à</span>
                        </Link>
                      </MenuItem>
                    )}
                  {currentUser.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') &&
                    ((task.profileId === profile.id && task.state === TaskState.CREATED) ||
                      (task.senderId === profile.id && task.senderState === TaskState.CREATED)) && (
                      <MenuItem>
                        <Link from={routePath} to="../../validate-personal-task/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                          <BsFillCircleFill className={styles.icon} color="#31385A" />
                          <span className={styles.text}>En attente</span>
                        </Link>
                      </MenuItem>
                    )}
                  <MenuItem>
                    <Link from={routePath} to="../../personal-task-details/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                      <BsEyeFill className={styles.icon} />
                      <span className={styles.text}>Ouvrir</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routePath} to="../../task-comments/$taskId" params={{ taskId: task.id }} search preload="render" onClick={onClose}>
                      <MdOutlineComment className={styles.icon} />
                      <span className={styles.text}>Commentaires</span>
                    </Link>
                  </MenuItem>
                  {hasLink && !task.technicalSupportId && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="../../unlink-personal-task/$taskId"
                        params={{ taskId: task.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <GoUnlink className={styles.icon} /> <span className={styles.text}>Supprimer la liaison</span>
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
