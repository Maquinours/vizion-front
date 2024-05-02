import { Link } from '@tanstack/react-router';
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
    link: string;
  }>;
}> = [
  {
    label: 'Exploitation',
    tools: [
      {
        icon: FaCalendarAlt,
        label: 'Agenda',
        link: '/app/tools/scheduler',
      },
      {
        icon: FaFileImport,
        label: 'Liens externes',
        link: '/app/tools/external-links',
      },
      {
        icon: MdDns,
        label: 'Base DDNS',
        link: '/app/tools/ddns',
      },
      {
        icon: IoNewspaper,
        label: 'Actualités',
        link: '/app/tools/news',
      },
      {
        icon: TbMailUp,
        label: 'Historique des mails recus et envoyés',
        link: '/app/tools/emails',
      },
      {
        icon: MdMailOutline,
        label: 'Messages prédéfinis',
        link: '/app/tools/predefined-messages',
      },
      {
        icon: TbFileDescription,
        label: 'Textes prédéfinis',
        link: '/app/tools/predefined-texts',
      },
      {
        icon: MdMailOutline,
        label: 'Courriers',
        link: '/app/tools/mails',
      },
    ],
  },
  {
    label: 'Entreprise',
    tools: [
      {
        icon: MdPerson,
        label: 'Carte des représentants',
        link: '/app/tools/representatives-map',
      },
      {
        icon: MdWork,
        label: 'CA global',
        link: '/app/tools/global-turnover',
      },
      {
        icon: MdWork,
        label: 'CA des représentants',
        link: '/app/tools/representatives-turnover',
      },
      {
        icon: FaFileImport,
        label: 'Import VVA',
        link: '/app/tools/vva',
      },
      {
        icon: MdLocationPin,
        label: 'Départements',
        link: '/app/tools/departments',
      },
      {
        icon: IoMdAddCircleOutline,
        label: 'Ajouter une entreprise',
        link: '/app/tools/enterprise/new-enterprise',
      },
      {
        icon: FaEuroSign,
        label: 'Avoirs',
        link: '/app/tools/credit',
      },
      {
        icon: BsPersonWorkspace,
        label: 'Formations',
        link: '/app/tools/formations',
      },
    ],
  },
  {
    label: 'Produit',
    tools: [
      {
        icon: FaFilter,
        label: 'Filtres',
        link: '/app/tools/product-filters',
      },
      {
        icon: MdShelves,
        label: 'Etagères',
        link: '/app/tools/product-shelves',
      },
      {
        icon: IoMdAddCircleOutline,
        label: 'Ajouter un produit',
        link: '#',
      },
      {
        icon: MdOutlineInventory,
        label: 'Inventaire',
        link: '/app/tools/product-inventory',
      },
    ],
  },
];

export default function AppViewToolsMenuView() {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h2>Menu Outils</h2>

        <div className={styles.menu_container}>
          <div className={styles.menu_buttons}>
            {menus.map((menu) => (
              <div key={menu.label} className={styles.menu_section}>
                <div className={styles.section_title}>{menu.label}</div>
                {menu.tools.map((tool) => (
                  <Link key={tool.label} to={tool.link} className={styles.menu}>
                    {React.createElement(tool.icon, { className: styles.icon })}
                    <span className={styles.title}>{tool.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
