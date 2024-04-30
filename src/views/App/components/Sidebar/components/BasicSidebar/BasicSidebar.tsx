import { MdBusinessCenter, MdGroups, MdGroup, MdSell, MdQuestionAnswer, MdLeakAdd, MdBuild } from 'react-icons/md';
import styles from './BasicSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import React, { useMemo } from 'react';
import { IconType } from 'react-icons/lib';
import { IoMdHome } from 'react-icons/io';

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

export default function SidebarComponentBasicSidebarComponent() {
  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const MENUS: MenuItem[] = useMemo(
    () => [
      {
        icon: MdBusinessCenter,
        label: 'Nouvelle affaire',
        route: {
          params: (old) => old,
          search: (old) => ({ ...old, appModal: 'create-client-business', businessId: undefined, gedItemKey: undefined }),
        },
        allowedRoles: ['ROLE_DISTRIBUTEUR', 'ROLE_CLIENT'],
      },
      {
        icon: IoMdHome,
        label: 'Tableau de bord',
        route: {
          to: '/app/dashboard',
          search: {},
          params: {},
        },
        allowedRoles: ['ROLE_MEMBRE_VIZEO'],
      },
      {
        icon: MdBusinessCenter,
        label: 'Affaires',
        route: {
          to: '/app/businesses-rma',
          search: {},
          params: {},
        },
      },
      {
        icon: MdGroup,
        label: 'Mon entreprise',
        route: {
          to: '/app/enterprises/$enterpriseId',
          search: {},
          params: { entepriseId: authentifiedUser.profile.enterprise!.id },
        },
        allowedRoles: ['ROLE_CLIENT'],
      },
      {
        icon: MdSell,
        label: 'Produits',
        route: {
          to: '/app/products',
          search: {},
          params: {},
        },
      },
      {
        icon: MdGroups,
        label: 'Entreprises',
        route: {
          to: '/app/enterprises',
          search: {},
          params: {},
        },
        allowedRoles: ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT', 'ROLE_DISTRIBUTEUR'],
      },
      {
        icon: MdQuestionAnswer,
        label: 'FAQ',
        route: {
          to: '/app/faq',
          search: {},
          params: {},
        },
      },
      {
        icon: MdLeakAdd,
        label: 'Liens externes',
        route: {
          to: '/app/external-links',
          search: {},
          params: {},
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
    ],
    [authentifiedUser.profile.enterprise],
  );

  const menus = useMemo(
    () => MENUS.filter((menu) => !menu.allowedRoles || menu.allowedRoles.some((role) => authentifiedUser.userInfo.roles.includes(role))),
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
