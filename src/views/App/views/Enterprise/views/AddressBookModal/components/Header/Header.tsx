import { Link } from '@tanstack/react-router';
import { BiImport } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdAddCircleOutline } from 'react-icons/io';
import styles from './Header.module.scss';

const routePath = '/app/enterprises/$enterpriseId/address-book';

export default function AppViewEnterpriseViewAddressBookModalViewHeaderComponent() {
  return (
    <div className={styles.modal_header}>
      <div className="flex gap-x-2">
        <Link from={routePath} to=".." search replace resetScroll={false}>
          <BsArrowLeft width="16" height="16" color="#FFF" />
        </Link>
        <div className="w-4"></div>
      </div>
      <div className={styles.modal_title}>{"Carnet d'adresse"}</div>
      <div className="flex gap-x-2">
        <Link from={routePath} to="import" search replace resetScroll={false} preload="intent" title="Importer des adresses">
          <BiImport width={16} height={16} color="#FFF" />
        </Link>
        <Link from={routePath} to="create" search replace resetScroll={false} preload="intent">
          <IoMdAddCircleOutline width="16" height="16" color="#FFF" />
        </Link>
      </div>
    </div>
  );
}
