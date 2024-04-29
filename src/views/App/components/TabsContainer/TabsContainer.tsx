import { useQueryClient } from '@tanstack/react-query';
import { Link, LinkProps, useMatchRoute, useMatches, useNavigate } from '@tanstack/react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { queries } from '../../../../utils/constants/queryKeys';
import styles from './TabsContainer.module.scss';
import classNames from 'classnames';

type Tab = {
  id: string;
  name: string;
  route: LinkProps;
};

export default function AppViewTabsContainerComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);
  const matches = useMatches();
  const matchRoute = useMatchRoute();

  const onCloseTab = (tab: Tab, index: number) => {
    setTabs((tabs) => {
      if (matchRoute({ to: tab.route.to })) navigate(tabs.at(Math.max(index - 1, 0))?.route ?? { to: '/app' });
      return tabs.filter((t) => t.id !== tab.id);
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
              return (
                (await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId((match.params as { businessId: string }).businessId))).title ??
                'Affaire inconnue'
              );
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
            const tabIndex = newTabs.findIndex((t) => t.id === tab.id);
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
          <div
            className={classNames(styles.tab, {
              [styles.active]: matchRoute({ to: tab.route.to }),
            })}
          >
            <Link {...tab.route} key={tab.id}>
              {tab.name}
            </Link>
            <button onClick={() => onCloseTab(tab, index)}>
              <MdClose />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
