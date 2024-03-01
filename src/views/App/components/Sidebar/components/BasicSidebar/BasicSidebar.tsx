import styles from './BasicSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';

type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

export default function SidebarComponentBasicSidebarComponent() {
  const menus: MenuItem[] = [];

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <ul>
          {menus.map((menu) => (
            <Link
              key={menu.label}
              {...menu.route}
              activeProps={{
                className: styles.active,
              }}
              className={styles.item}
            >
              {menu.icon}
              <span className={styles.label}>{menu.label}</span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
