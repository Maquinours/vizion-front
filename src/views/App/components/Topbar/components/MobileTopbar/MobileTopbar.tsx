import { useQueryClient } from '@tanstack/react-query';
import { Link, getRouteApi, useMatches } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { HiMenuAlt1 } from 'react-icons/hi';
import { MdClose, MdLogout } from 'react-icons/md';
import styles from './MobileTopbar.module.scss';

const routeApi = getRouteApi('/app');

type AppLayoutTopbarComponentMobileTopbarProps = {
  logout: () => void;
};
export default function AppLayoutTopbarComponentMobileTopbar({ logout }: Readonly<AppLayoutTopbarComponentMobileTopbarProps>) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');

  const { mobileSidebar } = routeApi.useSearch();

  const matches = useMatches();

  useEffect(() => {
    (async () => {
      for (const match of matches) {
        if (!!match.staticData.title) return match.staticData.title;
        else if (!!match.staticData.getTitle) return match.staticData.getTitle(queryClient, match);
      }
      return '';
    })().then((title) => setTitle(title));
  }, [matches]);

  return (
    <div className={styles.container}>
      <div className={styles.left_menu_icon}>
        <Link to="." search={{ mobileSidebar: mobileSidebar ? undefined : true }} replace resetScroll={false} ignoreBlocker>
          {mobileSidebar ? <MdClose /> : <HiMenuAlt1 />}
        </Link>
      </div>
      <div className={styles.current_page}>
        <p>{title}</p>
      </div>
      <button className={styles.right_menu_icon} onClick={logout}>
        {!mobileSidebar && <MdLogout />}
      </button>
    </div>
  );
}
