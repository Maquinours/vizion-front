import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './MobileTopbar.module.scss';
import { MdClose, MdLogout } from 'react-icons/md';
import { HiMenuAlt1 } from 'react-icons/hi';

const Route = getRouteApi('/app');

type AppLayoutTopbarComponentMobileTopbarProps = {
  logout: () => void;
};
export default function AppLayoutTopbarComponentMobileTopbar({ logout }: Readonly<AppLayoutTopbarComponentMobileTopbarProps>) {
  const { showMobileMenu } = Route.useSearch();

  return (
    <div className={styles.container}>
      <div className={styles.left_menu_icon}>
        <Link from={Route.id} search={{ showMobileMenu: !showMobileMenu }}>
          {showMobileMenu ? <MdClose /> : <HiMenuAlt1 />}
        </Link>
      </div>
      <div className={styles.current_page}>{/* <p>{title}</p> TODO: REIMPLEMENT THIS*/}</div>
      <button className={styles.right_menu_icon} onClick={logout}>
        {!showMobileMenu && <MdLogout />}
      </button>
    </div>
  );
}
