import { MdBusinessCenter, MdPerson } from 'react-icons/md';
import styles from './MobileSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { IconType } from 'react-icons/lib';
import React from 'react';

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
      search: (old) => ({ ...old, modal: 'create-business', businessId: undefined, gedItemKey: undefined }),
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
