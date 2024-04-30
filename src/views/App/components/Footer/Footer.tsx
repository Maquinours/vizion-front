import { Link, LinkProps, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { MdGroup, MdGroups, MdSell, MdQuestionAnswer, MdBusinessCenter, MdBuild } from 'react-icons/md';
import { IconType } from 'react-icons/lib';

const Route = getRouteApi('/app');

type MenuItem = {
  icon: IconType;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

export default function AppViewFooterComponent() {
  const { mobileSidebar } = Route.useSearch();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const MENUS: Array<MenuItem> = useMemo(
    () => [
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
    <footer className={classNames(styles.container, { [styles.open]: mobileSidebar })}>
      <div className={styles.menu}>
        <div className={styles.items}>
          <ul>
            {menus.map((item) => (
              <Link
                key={item.label}
                {...item.route}
                activeOptions={{ exact: false, includeSearch: false }}
                activeProps={{ className: styles.active }}
                className={styles.item}
                preload="intent"
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
