import { Link, getRouteApi } from '@tanstack/react-router';
import { BsThreeDots } from 'react-icons/bs';
import { FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { MdLocationPin, MdMailOutline } from 'react-icons/md';
import AddressResponseDto from '../../../../../../../../../../utils/types/AddressResponseDto';
import styles from './Address.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/address-book');

type AppViewBusinessViewDashboardViewAddressBookModalViewAddressComponentProps = Readonly<{
  address: AddressResponseDto;
  index: number;
  onSelectAddress: (address: AddressResponseDto) => void;
}>;
export default function AppViewBusinessViewDashboardViewAddressBookModalViewAddressComponent({
  address,
  index,
  onSelectAddress,
}: AppViewBusinessViewDashboardViewAddressBookModalViewAddressComponentProps) {
  return (
    <div className={styles.address_card}>
      <div className={styles.header}>
        <div className={styles.header_title}>Adresse {index + 1}</div>
        <div className={styles.header_icon}>
          <BsThreeDots color="#F24C52" />
          <div className={styles.header_tooltip}>
            <div>
              <Link from={routeApi.id} to="update/$addressId" search params={{ addressId: address.id }} replace resetScroll={false} preload="viewport">
                <span className={styles.icon}>
                  <HiPencilAlt width={13} height={13} color={'#16204E'} />
                </span>
                <span className={styles.text}>Modifier</span>
              </Link>
              <Link from={routeApi.id} to="delete/$addressId" search params={{ addressId: address.id }} replace resetScroll={false} preload="viewport">
                <span className={styles.icon}>
                  <FaTrash width={13} height={13} color={'#16204E'} />
                </span>
                <span className={styles.text}>Supprimer la ligne</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <button className={styles.content} onClick={() => onSelectAddress(address)}>
        <div className={styles.details}>
          <div className={styles.icon}>
            <MdLocationPin width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.enterpriseName}</p>
            <p>{address.fullName}</p>
            <p>{address.addressLineOne}</p>
            <p>
              {address.zipCode} {address.city}
            </p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.icon}>
            <FaPhoneAlt width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.phoneNumber ?? 'Aucun numéro de téléphone renseigné'}</p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.icon}>
            <MdMailOutline width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.email}</p>
          </div>
        </div>
      </button>
    </div>
  );
}
