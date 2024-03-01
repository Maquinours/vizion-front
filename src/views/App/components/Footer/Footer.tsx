import { Link, LinkProps, getRouteApi } from '@tanstack/react-router';
import styles from './Footer.module.scss';
import classNames from 'classnames';

const Route = getRouteApi('/app');

type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

const menus: Array<MenuItem> = [];

export default function AppViewFooterComponent() {
  const { showMobileMenu } = Route.useSearch();

  return (
    <footer className={classNames({ [styles.open]: showMobileMenu })}>
      <div className={styles.menu}>
        <div className={styles.items}>
          <ul>
            {menus.map((item) => (
              <Link key={item.label} {...item.route} activeProps={{ className: styles.active }} className={styles.item}>
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
