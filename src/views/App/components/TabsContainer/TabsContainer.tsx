import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { VirtualElement } from '@popperjs/core';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { ToOptions, ToPathOption, useMatchRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import { UserRole } from '../../../../utils/types/ProfileInfoResponseDto';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import styles from './TabsContainer.module.scss';
import AppViewTabsContainerComponentTabComponent from './components/Tab/Tab';
import AppViewTabsContainerComponentTabContextMenuComponent from './components/TabContextMenu/TabContextMenu';
import { TabsContext } from './utils/contexts/context';

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

  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<Tab>();

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

  const removeTabs = useCallback(
    (tabs: Array<Tab>) => {
      const removedTabs: Array<Tab> = [];
      setTabs((currentTabs) => {
        const result = currentTabs.filter((t) => {
          if (tabs.some((tab) => tab.id === t.id)) {
            removedTabs.push(t);
            return false;
          }
          return true;
        });
        if (removedTabs.some((tab) => matchRoute({ to: tab.route.to }))) navigate({ ...(result.at(-1)?.route ?? { to: '/app' }), ignoreBlocker: true });
        return result;
      });
    },
    [setTabs, matchRoute, navigate],
  );

  const removeTab = useCallback(
    (tab?: Tab) => {
      tab = tab ?? tabs.find((tab) => matchRoute({ to: tab.route.to }));
      if (tab) removeTabs([tab]);
    },
    [tabs, matchRoute, removeTabs],
  );

  const onCloseTab = useCallback(
    (e: React.MouseEvent, tab: Tab) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (tab.closeRoute) navigate(tab.closeRoute);
      else removeTab(tab);
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

  const onTabContextMenu = useCallback(
    (e: React.MouseEvent, tab: Tab) => {
      e.preventDefault();
      setSelectedTab(tab);
      setContextMenuAnchor({
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: e.clientX,
          y: e.clientY,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
          toJSON: () => {},
        }),
      });
    },
    [setSelectedTab, setContextMenuAnchor],
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
                <AppViewTabsContainerComponentTabComponent key={tab.id} tab={tab} onCloseTab={onCloseTab} onContextMenu={onTabContextMenu} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <AppViewTabsContainerComponentTabContextMenuComponent
        tabs={tabs}
        removeTabs={removeTabs}
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        selectedItem={selectedTab}
      />
      {children}
    </TabsContext.Provider>
  );
}
