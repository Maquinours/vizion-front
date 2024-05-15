import { useQueryClient } from '@tanstack/react-query';
import { Link, ToOptions, ToPathOption, useMatchRoute, useMatches, useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import React, { useCallback, useEffect, useMemo } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './TabsContainer.module.scss';
import { TabsContext } from './utils/contexts/context';

type Tab = {
  id: string;
  name: string;
  route: ToOptions;
  closable?: boolean;
  closeRoute?: ToOptions;
};

// const INITIAL_TABS = [
//   {
//     name: 'Tableau de bord',
//     route: {
//       to: '/app/dashboard',
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
//   {
//     name: 'Agenda',
//     route: {
//       to: '/app/tools/scheduler',
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
//   {
//     name: 'Mails',
//     route: {
//       to: '/app/tools/emails',
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
//   {
//     name: 'bd.vizeo.eu',
//     route: {
//       to: '/app/external-links/$externalLinkId',
//       params: {
//         externalLinkId: '39f7ca22-7986-4438-93c9-fbe88d7fc7ea',
//       },
//     },
//     closable: false,
//   },
//   {
//     name: 'Chat Vizeo',
//     route: {
//       to: '/app/external-links/$externalLinkId',
//       params: {
//         externalLinkId: '6c5c8543-1d10-4d9d-a962-30a5335a9bb5',
//       },
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
//   {
//     name: 'État des mails',
//     route: {
//       to: '/app/external-links/$externalLinkId',
//       params: {
//         externalLinkId: '8c067418-6514-454c-8462-841204eeaaaf',
//       },
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
//   {
//     name: 'Tableau des affaires',
//     route: {
//       to: '/app/businesses-rma',
//     },
//     allowedRoles: ['ROLE_MEMBRE_VIZEO'],
//     closable: false,
//   },
// ];

type AppViewTabsContainerComponentProps = Readonly<{
  children: React.ReactNode;
}>;
export default function AppViewTabsContainerComponent({ children }: AppViewTabsContainerComponentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const matches = useMatches();
  const matchRoute = useMatchRoute();

  const removeTab = useCallback(
    (tabId?: string) => {
      setTabs((tabs) => {
        const tabIndex = tabId ? tabs.findIndex((tab) => tab.id === tabId) : tabs.findIndex((tab) => matchRoute({ to: tab.route.to }));
        if (tabIndex !== -1) {
          const tab = tabs[tabIndex];
          if (matchRoute({ to: tab.route.to })) navigate(tabs.at(Math.max(tabIndex - 1, 0))?.route ?? { to: '/app' });

          const newTabs = [...tabs];
          newTabs.splice(tabIndex, 1);
          return newTabs;
        }
        return tabs; // if we can't remove, then we return the initial array
      });
    },
    [matchRoute, navigate, setTabs],
  );

  const onCloseTab = useCallback(
    (e: React.MouseEvent, tab: Tab) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (tab.closeRoute) navigate(tab.closeRoute);
      else removeTab(tab.id);
    },
    [removeTab],
  );

  const contextValue = useMemo(() => ({ removeTab }), [removeTab]);

  useEffect(() => {
    (async () => {
      for (const match of [...matches].reverse()) {
        const title = match.staticData.title ?? (match.staticData.getTitle ? await match.staticData.getTitle(queryClient, match) : undefined);
        if (title) {
          const route = matches.at(-1)!;
          const tabRoute = { to: route.routeId as ToPathOption, params: route.params, search: route.search };
          const tab: Tab = {
            id: match.pathname,
            name: title,
            route: tabRoute,
            closeRoute: match.staticData.closeTabRoute ? (match.staticData.closeTabRoute(tabRoute) as ToOptions) : undefined,
          };
          setTabs((tabs) => {
            const newTabs = [...tabs];
            const tabIndex = newTabs.findIndex((t) => tab.id === t.id);
            if (tabIndex !== -1) newTabs[tabIndex] = tab;
            else newTabs.push(tab);
            return newTabs;
          });
          return;
        }
      }
    })();
  }, [matches]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <Link
              {...tab.route}
              key={index}
              className={styles.tab}
              activeOptions={{ exact: true, includeSearch: false }}
              activeProps={{ className: styles.active }}
            >
              <span>{tab.name}</span>
              {(tab.closable === undefined || tab.closable) && (
                <button onClick={(e) => onCloseTab(e, tab)}>
                  <MdClose />
                </button>
              )}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </TabsContext.Provider>
  );
}
