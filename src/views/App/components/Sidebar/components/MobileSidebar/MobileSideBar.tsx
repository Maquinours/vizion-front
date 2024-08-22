import { Link, LinkProps, useLocation } from '@tanstack/react-router';
import React from 'react';
import { IoMdHome } from 'react-icons/io';
import { IconType } from 'react-icons/lib';
import { MdBusinessCenter, MdPerson } from 'react-icons/md';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './MobileSidebar.module.scss';
import { UserRole } from '../../../../../../utils/types/ProfileInfoResponseDto';

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps;
  allowedRoles?: Array<UserRole>;
};

const MENUS: MenuItem[] = [
  {
    icon: IoMdHome,
    label: 'Tableau de bord',
    route: {
      to: '/app/dashboard',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    icon: MdBusinessCenter,
    label: 'Nouvelle affaire',
    route: {
      search: (old) => ({ ...old, appModal: 'create-business', businessId: undefined, gedItemKey: undefined }),
      activeOptions: { exact: true, includeSearch: true },
      replace: true,
      resetScroll: false,
    },
  },
];

export default function SidebarComponentMobileSidebarComponent() {
  useLocation(); // We need to use useLocation to trigger a rerender of the links when the user navigates
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
