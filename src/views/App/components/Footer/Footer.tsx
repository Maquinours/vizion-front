import { Link, LinkProps, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { MdGroup, MdGroups, MdSell, MdQuestionAnswer, MdBusinessCenter, MdBuild } from 'react-icons/md';
import { IconType } from 'react-icons/lib';
import ProfileInfoResponseDto, { UserRole } from '../../../../utils/types/ProfileInfoResponseDto';

const routeApi = getRouteApi('/app');

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps | ((authentifiedUser: ProfileInfoResponseDto) => LinkProps);
  allowedRoles?: Array<UserRole>;
};

const MENUS: Array<MenuItem> = [
  {
    icon: MdBusinessCenter,
    label: 'Affaires',
    route: {
      to: '/app/businesses-rma',
    },
  },
  {
    icon: MdGroup,
    label: 'Mon entreprise',
    route: (authentifiedUser) => ({
      to: '/app/enterprises/$enterpriseId',
      params: { enterpriseId: authentifiedUser.profile.enterprise!.id },
    }),
    allowedRoles: ['ROLE_CLIENT'],
  },
  {
    icon: MdSell,
    label: 'Produits',
    route: {
      to: '/app/products',
    },
  },
  {
    icon: MdGroups,
    label: 'Entreprises',
    route: {
      to: '/app/enterprises',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT', 'ROLE_DISTRIBUTEUR'],
  },
  {
    icon: MdQuestionAnswer,
    label: 'FAQ',
    route: {
      to: '/app/faq',
    },
  },
  {
    icon: MdBuild,
    label: 'Outils',
    route: {
      to: '/app/tools/menu',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
];

export default function AppViewFooterComponent() {
  const { mobileSidebar } = routeApi.useSearch();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const menus = useMemo(
    () =>
      MENUS.filter((menu) => !menu.allowedRoles || menu.allowedRoles.some((role) => authentifiedUser.userInfo.roles.includes(role))).map((menu) => ({
        ...menu,
        route: typeof menu.route === 'function' ? menu.route(authentifiedUser) : menu.route,
      })),
    [MENUS, authentifiedUser],
  );

  return (
    <footer className={classNames(styles.container, { [styles.open]: mobileSidebar })}>
      <div className={styles.menu}>
        <div className={styles.items}>
          <ul>
            {menus.map((item) => (
              <Link
                key={item.label}
                {...item.route}
                preload="intent"
                activeOptions={{ exact: false, includeSearch: false }}
                activeProps={{ className: styles.active }}
                className={styles.item}
              >
                {React.createElement(item.icon)}
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
