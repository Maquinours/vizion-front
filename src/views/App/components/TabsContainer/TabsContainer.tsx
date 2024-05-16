import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Link, ToOptions, ToPathOption, useMatchRoute, useMatches, useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import React, { useCallback, useEffect, useMemo } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './TabsContainer.module.scss';
import { TabsContext } from './utils/contexts/context';
// import { queries } from '../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { queries } from '../../../../utils/constants/queryKeys';
import _ from 'lodash';

type Tab = {
  id: string;
  name: string;
  route: ToOptions;
  closable?: boolean;
  closeRoute?: ToOptions;
  initial?: boolean;
};

type InitialTab = {
  name: string;
  route?: ToOptions;
  getRoute?: (queryClient: QueryClient) => Promise<ToOptions>;
  allowedRoles?: Array<string>;
};

const getExternalLinkInitialTab = (name: string, allowedRoles?: Array<string>): InitialTab => {
  return {
    name,
    getRoute: async (queryClient: QueryClient): Promise<ToOptions> => {
      const externalLink = (await queryClient.ensureQueryData(queries['external-link'].list._ctx.byArchiveState(false))).find(({ title }) => title === name);
      if (!externalLink) throw Error(`Impossible de trouver le lien externe ${name}`);
      return {
        to: '/app/external-links/$externalLinkId',
        params: {
          externalLinkId: externalLink.id,
        },
      };
    },
    allowedRoles,
  };
};

const INITIAL_TABS: Array<InitialTab> = [
  {
    name: 'Tableau de bord',
    route: {
      to: '/app/dashboard',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    name: 'Agenda',
    route: {
      to: '/app/tools/scheduler',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    name: 'Emails',
    route: {
      to: '/app/tools/emails',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  getExternalLinkInitialTab('bd.vizeo.eu'),
  getExternalLinkInitialTab('Chat Vizeo', ['ROLE_MEMBRE_VIZEO']),
  getExternalLinkInitialTab('État des mails envoyés', ['ROLE_MEMBRE_VIZEO']),
  {
    name: 'Tableau des affaires',
    route: {
      to: '/app/businesses-rma',
    },
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
];

type AppViewTabsContainerComponentProps = Readonly<{
  children: React.ReactNode;
}>;
export default function AppViewTabsContainerComponent({ children }: AppViewTabsContainerComponentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const matches = useMatches();
  const matchRoute = useMatchRoute();

  const { data: user } = useAuthentifiedUserQuery();

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
      const initialTabs = (
        await Promise.all(
          INITIAL_TABS.filter((tab) => !tab.allowedRoles || tab.allowedRoles.some((role) => user.userInfo.roles.includes(role))).map(async (tab) => {
            try {
              const route = tab.route ? tab.route : tab.getRoute ? await tab.getRoute(queryClient) : undefined;
              if (!route) throw new Error('Unable to retrieve tab route');
              let id: string = route.to!;
              if (typeof route.params === 'object') for (const [key, value] of Object.entries(route.params)) id = id.replace(`$${key}`, value);
              return {
                id,
                name: tab.name,
                route,
                initial: true,
                closable: false,
              };
            } catch (err) {
              console.error(err);
            }
          }),
        )
      ).filter((tab) => !!tab) as Array<Tab>;
      setTabs((tabs) => {
        const newTabs = tabs.filter((tab) => !tab.initial);
        newTabs.forEach((tab, index) => {
          const initialIndex = initialTabs.findIndex((t) => t.id === tab.id);
          if (initialIndex !== -1) initialTabs[index] = tab;
        });
        return _.uniqBy([...initialTabs, ...newTabs], 'id');
      });
    })();
  }, [user.userInfo.roles]);

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
            closeRoute: match.staticData.getCloseTabRoute ? (match.staticData.getCloseTabRoute(tabRoute) as ToOptions) : undefined,
          };
          setTabs((tabs) => {
            const newTabs = [...tabs];
            const tabIndex = newTabs.findIndex((t) => tab.id === t.id);
            if (tabIndex !== -1) {
              const oldTab = newTabs[tabIndex];
              newTabs[tabIndex] = { ...oldTab, ...tab };
            } else newTabs.push(tab);
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
