import { useLocalStorage } from '@uidotdev/usehooks';
import styles from './TabsContainer.module.scss';
import { Link } from '@tanstack/react-router';
import { MdClose } from 'react-icons/md';

type Tab = {
  id: string;
  name: string;
  route: string;
};

export default function AppViewTabsContainerComponent() {
  const [tabs, setTabs] = useLocalStorage<Tab[]>('tabs', []);

  const onCloseTab = (tab: Tab) => {
    setTabs((tabs) => tabs.filter((t) => t.id !== tab.id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Link to={tab.route} key={tab.id}>
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
