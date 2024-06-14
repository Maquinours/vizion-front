import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { ToOptions, ToPathOption, useMatchRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import styles from './TabsContainer.module.scss';
import AppViewTabsContainerComponentTabComponent from './components/Tab/Tab';
import { TabsContext } from './utils/contexts/context';
import { UserRole } from '../../../../utils/types/ProfileInfoResponseDto';

export type Tab = {
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
  allowedRoles?: Array<UserRole>;
};

const getExternalLinkInitialTab = (name: string, allowedRoles?: Array<UserRole>): InitialTab => {
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
    allowedRoles: ['ROLE_CLIENT', 'ROLE_DISTRIBUTEUR', 'ROLE_REPRESENTANT'],
  },
];

type AppViewTabsContainerComponentProps = Readonly<{
  children: React.ReactNode;
}>;
export default function AppViewTabsContainerComponent({ children }: AppViewTabsContainerComponentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const { matches, resolvedLocation } = useRouterState({ select: (state) => ({ matches: state.matches, resolvedLocation: state.resolvedLocation }) });
  const matchRoute = useMatchRoute();

  const [isLoadingInitialTabs, setIsLoadingInitialTabs] = useState(false);
  const isLoadingInitialTabsRef = useRef(isLoadingInitialTabs);

  const { data: user } = useAuthentifiedUserQuery();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!!over && active.id !== over.id) {
        setTabs((items) => {
          const oldIndex = items.findIndex(({ id }) => id === active.id);
          const newIndex = items.findIndex(({ id }) => id === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setTabs],
  );

  const contextValue = useMemo(() => ({ removeTab }), [removeTab]);

  useEffect(() => {
    setIsLoadingInitialTabs(true);
    isLoadingInitialTabsRef.current = true;
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
      setTabs((tabs: Array<Tab> | null | undefined) => {
        initialTabs.forEach((tab, index, arr) => {
          const existingTab = tabs?.find((t) => t.id === tab.id);
          if (existingTab) arr[index] = { ...tab, route: existingTab.route };
        });
        const newTabs = tabs?.filter((tab) => !tab.initial) ?? [];
        newTabs.forEach((tab, index) => {
          const initialIndex = initialTabs.findIndex((t) => t.id === tab.id);
          if (initialIndex !== -1) initialTabs[index] = tab;
        });
        return _.uniqBy([...initialTabs, ...newTabs].reverse(), 'id').reverse();
      });
      setIsLoadingInitialTabs(false);
      isLoadingInitialTabsRef.current = false;
    })();
  }, [user.userInfo.roles]);

  useEffect(() => {
    if (!isLoadingInitialTabsRef.current && !isLoadingInitialTabs)
      (async () => {
        for (const match of [...matches].reverse()) {
          const title = match.staticData.title ?? (match.staticData.getTitle ? await match.staticData.getTitle(queryClient, match) : undefined);
          if (title) {
            const route = matches.at(-1)!;
            const tabRoute = { to: route.routeId as ToPathOption, params: route.params, search: route.search, state: resolvedLocation.state };
            const tab: Tab = {
              id: match.pathname,
              name: title,
              route: tabRoute,
              closeRoute: match.staticData.getCloseTabRoute ? (match.staticData.getCloseTabRoute(tabRoute) as ToOptions) : undefined,
            };
            setTabs((tabs: Array<Tab> | null | undefined) => {
              const newTabs = [...(tabs ?? [])];
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
  }, [resolvedLocation, isLoadingInitialTabs]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={tabs.map(({ id }) => id)} strategy={horizontalListSortingStrategy}>
              {tabs.map((tab) => (
                <AppViewTabsContainerComponentTabComponent key={tab.id} tab={tab} onCloseTab={onCloseTab} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      {children}
    </TabsContext.Provider>
  );
}
