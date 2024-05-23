import ReactModal from 'react-modal';
import styles from './AddressBookModal.module.scss';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdAddCircleOutline } from 'react-icons/io';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PulseLoader } from 'react-spinners';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import { useContext, useEffect } from 'react';
import AppViewBusinessViewDashboardViewAddressBookModalViewAddressComponent from './components/Address/Address';
import { BusinessDashboardContext } from '../../utils/contexts/context';
import AddressResponseDto from '../../../../../../../../utils/types/AddressResponseDto';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/address-book');

const size = 9;

const yupSchema = yup.object().shape({
  searchText: yup.string(),
});

export default function AppViewBusinessViewDashboardViewAddressBookModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { setValue: setContextValue } = useContext(BusinessDashboardContext)!;

  const { businessId } = routeApi.useParams();
  const { searchText, page } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data, isLoading } = useQuery(queries.address.page._ctx.searchByEnterpriseId({ enterpriseId: business.enterpriseId, searchText }, { page, size }));

  const { register, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, page: undefined, searchText: undefined }), replace: true });
  };

  const onSearch = ({ searchText }: yup.InferType<typeof yupSchema>) => {
    navigate({ search: (old) => ({ ...old, searchText, page: 0 }), replace: true });
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, searchText: undefined, page: 0 }), replace: true });
  };

  const onSelectAddress = (address: AddressResponseDto) => {
    setContextValue('receiverCompanyName', address.enterpriseName);
    setContextValue('receiverName', address.fullName);
    setContextValue('receiverAddressOne', address.addressLineOne);
    setContextValue('receiverAddressTwo', address.addressLineTwo);
    setContextValue('receiverZipCode', address.zipCode);
    setContextValue('receiverCity', address.city);
    setContextValue('receiverPhoneNumber', address.phoneNumber);
    setContextValue('receiverEmail', address.email);
    onClose();
  };

  useEffect(() => {
    setValue('searchText', searchText);
  }, [searchText]);

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.address_book_modal} overlayClassName="Overlay">
        <div className={styles.modal_content}>
          <div className={styles.modal_header}>
            <button onClick={onClose}>
              <BsArrowLeft width="16" height="16" color="#FFF" />
            </button>
            <div className={styles.modal_title}>{"Carnet d'adresse"}</div>
            <Link from={routeApi.id} to="create" search={(old) => old} replace>
              <IoMdAddCircleOutline width="16" height="16" color="#FFF" />
            </Link>
          </div>

          <div className={styles.modal_body}>
            <div className={styles.research_container}>
              <form onSubmit={handleSubmit(onSearch)} onReset={onReset}>
                <input type="string" {...register('searchText')} id="searchValue" placeholder="Entrer le texte..." />
                <button type="reset" className="btn btn-primary">
                  RAZ
                </button>
                <button type="submit" className="btn btn-secondary">
                  Rechercher
                </button>
              </form>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <PulseLoader color="#31385A" loading={isLoading} className="" size={10} speedMultiplier={0.5} />
            </div>
            {data?.content.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                Aucune adresse enregistrée
              </div>
            )}
            {data && data.content.length > 0 && (
              <>
                <div className={styles.address_container}>
                  {data.content.map((address, index) => (
                    <AppViewBusinessViewDashboardViewAddressBookModalViewAddressComponent
                      key={address.id}
                      address={address}
                      index={index}
                      onSelectAddress={onSelectAddress}
                    />
                  ))}
                </div>
                <div className={styles.pagination}>
                  <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={(page) => ({ search: (old) => ({ ...old, page }), replace: true })} />
                </div>
              </>
            )}
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
