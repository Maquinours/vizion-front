import { MdBusinessCenter, MdGroups, MdGroup, MdSell, MdQuestionAnswer, MdLeakAdd, MdBuild } from 'react-icons/md';
import styles from './BasicSidebar.module.scss';
import { Link, LinkProps, useLocation } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import React, { useMemo } from 'react';
import { IconType } from 'react-icons/lib';
import { IoMdHome } from 'react-icons/io';
import ProfileInfoResponseDto, { UserRole } from '../../../../../../utils/types/ProfileInfoResponseDto';

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps | ((authentifiedUser: ProfileInfoResponseDto) => LinkProps);
  allowedRoles?: Array<UserRole>;
};

const MENUS: Array<MenuItem> = [
  {
    icon: MdBusinessCenter,
    label: 'Nouvelle affaire',
    route: {
      search: (old) => ({ ...old, appModal: 'create-client-business', businessId: undefined, gedItemKey: undefined }),
      activeOptions: { exact: true, includeSearch: true },
      replace: true,
      resetScroll: false,
      ignoreBlocker: true,
    },
    allowedRoles: ['ROLE_DISTRIBUTEUR', 'ROLE_CLIENT'],
  },
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
    icon: MdLeakAdd,
    label: 'Liens externes',
    route: {
      to: '/app/external-links',
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

export default function SidebarComponentBasicSidebarComponent() {
  useLocation(); // We need to use useLocation to trigger a rerender of the links when the user navigates
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const menus = useMemo(
    () =>
      MENUS.filter((menu) => !menu.allowedRoles || menu.allowedRoles.some((role) => authentifiedUser.userInfo.roles.includes(role))).map((menu) => ({
        ...menu,
        route: typeof menu.route === 'function' ? menu.route(authentifiedUser) : menu.route,
      })),
    [MENUS, authentifiedUser.userInfo.roles],
  );

  return (
    <div className={styles.container}>
      <div className={styles.items}>
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
      </div>
    </div>
  );
}
