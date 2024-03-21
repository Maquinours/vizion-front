import { Link, LinkProps, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';
import classNames from 'classnames';
import React from 'react';

const Route = getRouteApi('/app');

type MenuItem = {
  icon: React.JSX.Element;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

const menus: Array<MenuItem> = [];

export default function AppViewFooterComponent() {
  const { mobileSidebar } = Route.useSearch();

  return (
    <footer className={classNames({ [styles.open]: mobileSidebar })}>
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
                {item.icon}
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
