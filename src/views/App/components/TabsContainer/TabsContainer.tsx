import { useQueryClient } from '@tanstack/react-query';
import { Link, LinkProps, useMatchRoute, useMatches, useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './TabsContainer.module.scss';

type Tab = {
  id: string;
  name: string;
  route: LinkProps;
  closable?: boolean;
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

export default function AppViewTabsContainerComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const matches = useMatches();
  const matchRoute = useMatchRoute();

  const onCloseTab = (e: React.MouseEvent, tab: Tab, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setTabs((tabs) => {
      if (matchRoute({ to: tab.route.to })) navigate(tabs.at(Math.max(index - 1, 0))?.route ?? { to: '/app' });
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      return newTabs;
    });
  };

  useEffect(() => {
    (async () => {
      for (const match of [...matches].reverse()) {
        const title = await (async () => {
          switch (match.routeId) {
            case '/app/enterprises/$enterpriseId':
              return (await queryClient.ensureQueryData(queries.enterprise.detail((match.params as { enterpriseId: string }).enterpriseId))).name;
            case '/app/products/$productId':
              return (
                (await queryClient.ensureQueryData(queries.product.detail((match.params as { productId: string }).productId))).reference ?? 'Produit inconnu'
              );
            case '/app/businesses-rma/business/$businessId':
              const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId((match.params as { businessId: string }).businessId));
              return `Affaire (${business.numBusiness})`;
            case '/app/external-links/$externalLinkId':
              return (await queryClient.ensureQueryData(queries['external-link'].detail._ctx.byId((match.params as { externalLinkId: string }).externalLinkId)))
                .title;
            default:
              return match.staticData.title;
          }
        })();
        if (title) {
          const route = matches.at(-1)!;
          const tab = { id: match.routeId, name: title, route: { to: route.routeId, params: route.params, search: route.search } };
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
              <button onClick={(e) => onCloseTab(e, tab, index)}>
                <MdClose />
              </button>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
