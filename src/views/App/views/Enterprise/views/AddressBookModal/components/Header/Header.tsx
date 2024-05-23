import { BsArrowLeft } from 'react-icons/bs';
import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './Header.module.scss';
import { IoMdAddCircleOutline } from 'react-icons/io';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book');
export default function AppViewEnterpriseViewAddressBookModalViewHeaderComponent() {
  return (
    <div className={styles.modal_header}>
      <Link from={Route.id} to=".." search={(old) => old} replace>
        <BsArrowLeft width="16" height="16" color="#FFF" />
      </Link>
      <div className={styles.modal_title}>{"Carnet d'adresse"}</div>
      <Link from={Route.id} to="./create" search={(old) => old} replace>
        <IoMdAddCircleOutline width="16" height="16" color="#FFF" />
      </Link>
    </div>
  );
}
