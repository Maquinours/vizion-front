import { MdPerson } from 'react-icons/md';
import styles from './MobileSidebar.module.scss';
import { Link, LinkProps } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: LinkProps;
  allowedRoles?: string[];
};

const menus: MenuItem[] = [];

export default function SidebarComponentMobileSidebarComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

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

          <div className={styles.footer}>
            <div className={styles.icons}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
