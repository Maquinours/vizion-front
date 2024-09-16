import { Link, LinkOptions, Outlet } from '@tanstack/react-router';
import React from 'react';
import { BsPersonWorkspace } from 'react-icons/bs';
import { FaCalendarAlt, FaEuroSign, FaFileImport, FaFilter } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoNewspaper } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { MdDns, MdLocationPin, MdMailOutline, MdOutlineInventory, MdPerson, MdShelves, MdWork } from 'react-icons/md';
import { TbFileDescription, TbMailUp } from 'react-icons/tb';
import styles from './Menu.module.scss';

const menus: Array<{
  label: string;
  tools: Array<{
    icon: IconType;
    label: string;
    link: Pick<LinkOptions, 'to' | 'resetScroll' | 'replace'>;
    disabled?: boolean;
  }>;
}> = [
  {
    label: 'Exploitation',
    tools: [
      {
        icon: FaCalendarAlt,
        label: 'Agenda',
        link: {
          to: '/app/tools/scheduler',
        },
      },
      {
        icon: FaFileImport,
        label: 'Liens externes',
        link: {
          to: '/app/tools/external-links',
        },
      },
      {
        icon: MdDns,
        label: 'Base DDNS',
        link: {
          to: '/app/tools/ddns',
        },
      },
      {
        icon: IoNewspaper,
        label: 'Actualités',
        link: {
          to: '/app/tools/news',
        },
      },
      {
        icon: TbMailUp,
        label: 'Historique des mails recus et envoyés',
        link: {
          to: '/app/tools/emails',
        },
      },
      {
        icon: MdMailOutline,
        label: 'Messages prédéfinis',
        link: {
          to: '/app/tools/predefined-messages',
        },
      },
      {
        icon: TbFileDescription,
        label: 'Textes prédéfinis',
        link: {
          to: '/app/tools/predefined-texts',
        },
      },
      {
        icon: MdMailOutline,
        label: 'Courriers',
        link: {
          to: '/app/tools/mails',
        },
      },
    ],
  },
  {
    label: 'Entreprise',
    tools: [
      {
        icon: MdPerson,
        label: 'Carte des représentants',
        link: {
          to: '/app/tools/representatives-map',
        },
      },
      {
        icon: MdWork,
        label: 'CA global',
        link: {
          to: '/app/tools/global-turnover',
        },
      },
      {
        icon: MdWork,
        label: 'CA des représentants',
        link: {
          to: '/app/tools/representatives-turnover',
        },
        disabled: true,
      },
      {
        icon: FaFileImport,
        label: 'Import VVA',
        link: {
          to: '/app/tools/vva',
        },
      },
      {
        icon: MdLocationPin,
        label: 'Départements',
        link: {
          to: '/app/tools/departments',
        },
      },
      {
        icon: IoMdAddCircleOutline,
        label: 'Ajouter une entreprise',
        link: {
          to: '/app/tools/menu/create-enterprise',
          resetScroll: false,
          replace: true,
        },
      },
      {
        icon: FaEuroSign,
        label: 'Avoirs',
        link: {
          to: '/app/tools/credit',
        },
      },
      {
        icon: BsPersonWorkspace,
        label: 'Formations',
        link: {
          to: '/app/tools/formations',
        },
      },
    ],
  },
  {
    label: 'Produit',
    tools: [
      {
        icon: FaFilter,
        label: 'Filtres',
        link: {
          to: '/app/tools/product-filters',
        },
      },
      {
        icon: MdShelves,
        label: 'Etagères',
        link: {
          to: '/app/tools/product-shelves',
        },
      },
      {
        icon: IoMdAddCircleOutline,
        label: 'Ajouter un produit',
        link: {
          to: '/app/tools/menu/create-product',
          resetScroll: false,
          replace: true,
        },
      },
      {
        icon: MdOutlineInventory,
        label: 'Inventaire',
        link: {
          to: '/app/tools/product-inventory',
        },
      },
    ],
  },
];

export default function AppViewToolsMenuView() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.menu}>
          <h2>Menu Outils</h2>

          <div className={styles.menu_container}>
            <div className={styles.menu_buttons}>
              {menus.map((menu) => (
                <div key={menu.label} className={styles.menu_section}>
                  <div className={styles.section_title}>{menu.label}</div>
                  {menu.tools.map((tool) => {
                    const children = (
                      <>
                        {React.createElement(tool.icon, { className: styles.icon })}
                        <span className={styles.title}>{tool.label}</span>
                      </>
                    );
                    if (tool.disabled)
                      return (
                        <button key={tool.label} className={styles.menu} disabled>
                          {children}
                        </button>
                      );
                    else
                      return (
                        <Link key={tool.label} {...tool.link} className={styles.menu}>
                          {children}
                        </Link>
                      );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
