import { MdBusinessCenter } from 'react-icons/md';
import styles from './BasicSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import React from 'react';
import { IconType } from 'react-icons/lib';
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
    icon: MdBusinessCenter,
    label: 'Nouvelle affaire',
    route: {
      params: (old) => old,
      search: (old) => ({ ...old, modal: 'create-client-business', businessId: undefined, gedItemKey: undefined }),
    },
    allowedRoles: ['ROLE_DISTRIBUTEUR', 'ROLE_CLIENT'],
  },
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
      params: (old) => old,
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
];

export default function SidebarComponentBasicSidebarComponent() {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const menus = MENUS.filter((menu) => !menu.allowedRoles || menu.allowedRoles.some((role) => authentifiedUser.userInfo.roles.includes(role)));

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <div>
          {menus.map((menu) => (
            <Link
              key={menu.label}
              activeOptions={{ exact: false, includeSearch: false }}
              {...menu.route}
              preload="intent"
              activeProps={{
                className: styles.active,
              }}
              className={styles.item}
            >
              {React.createElement(menu.icon, { className: styles.icon })}
              <span className={styles.label}>{menu.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
