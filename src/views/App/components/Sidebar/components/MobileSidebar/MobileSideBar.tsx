import { MdBusinessCenter, MdPerson } from 'react-icons/md';
import styles from './MobileSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { IconType } from 'react-icons/lib';
import React from 'react';
import { IoMdHome } from 'react-icons/io';
import TaskState from '../../../../../../utils/enums/TaskState';
import { Views } from 'react-big-calendar';

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

const MENUS: MenuItem[] = [
  {
    icon: IoMdHome,
    label: 'Tableau de bord',
    route: {
      to: '/app/dashboard',
      search: (old) => ({
        ...old,
        personalTaskState: TaskState.CREATED,
        personalTaskPage: 0,
        personalTaskSize: 10,
        schedulerView: Views.DAY,
        schedulerDate: new Date(),
      }),
      params: {},
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    icon: MdBusinessCenter,
    label: 'Nouvelle affaire',
    route: {
      params: (old) => old,
      search: (old) => ({ ...old, appModal: 'create-business', businessId: undefined, gedItemKey: undefined }),
      activeOptions: { exact: true, includeSearch: true },
    },
  },
];

export default function SidebarComponentMobileSidebarComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

  const menus = MENUS.filter((menu) => !menu.allowedRoles || menu.allowedRoles.some((role) => currentUser.userInfo.roles.includes(role)));

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            <MdPerson />
          </div>
          <div className={styles.informations}>
            <span>{currentUser.userInfo.firstName}</span>
            <span>{currentUser.userInfo.lastName}</span>
          </div>
        </div>
        <div className={styles.bottom}>
          <div>
            {menus.map((menu) => (
              <Link
                key={menu.label}
                activeOptions={{ exact: false, includeSearch: false }}
                {...menu.route}
                activeProps={{
                  className: styles.active,
                }}
                preload="intent"
                className={styles.item}
              >
                {React.createElement(menu.icon, { className: styles.icon })}
                <span className={styles.label}>{menu.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.icons}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
