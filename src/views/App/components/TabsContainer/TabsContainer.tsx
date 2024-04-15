import { useLocalStorage } from '@uidotdev/usehooks';
import styles from './TabsContainer.module.scss';
import { Link, LinkProps, useRouterState } from '@tanstack/react-router';
import { MdClose } from 'react-icons/md';
import { useEffect } from 'react';
import { possibleTabs } from '../../../../utils/constants/possibleTabs';

type Tab = {
  id: string;
  name: string;
  route: LinkProps;
};

export default function AppViewTabsContainerComponent() {
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const { matches } = useRouterState();

  const onCloseTab = (tab: Tab) => {
    setTabs((tabs) => tabs.filter((t) => t.id !== tab.id));
  };

  useEffect(() => {
    (async () => {
      const tab = possibleTabs.find((tab) => matches.find((match) => match.routeId === tab.id));
      if (tab) {
        const currentPage = matches.at(-1)!;
        const newTab = {
          id: tab.id,
          name: tab.name,
          route: { to: currentPage.routeId, params: currentPage.params, search: currentPage.search } as LinkProps,
        };
        setTabs((tabs) => {
          const tabIndex = tabs.findIndex((t) => t.id === newTab.id);
          if (tabIndex !== -1) tabs[tabIndex] = newTab;
          else tabs.push(newTab);
          return [...tabs];
        });
      }
    })();
  }, [matches]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Link {...tab.route} key={tab.id} className={styles.tab} activeProps={{ className: styles.active }} activeOptions={{ includeSearch: false }}>
            <span>{tab.name}</span>
            <button onClick={() => onCloseTab(tab)}>
              <MdClose />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
