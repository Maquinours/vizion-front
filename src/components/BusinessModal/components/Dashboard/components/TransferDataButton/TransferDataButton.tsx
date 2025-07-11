import { UseFormSetValue } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { BusinessDashboardFormType } from '../../Dashboard';
import styles from './TransferDataButton.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');

type BusinessModalComponentDashboardComponentTransferDataButtonComponentProps = Readonly<{
  business: BusinessResponseDto;
  setValue: UseFormSetValue<BusinessDashboardFormType>;
  saveBusiness: () => void;
}>;
export default function BusinessModalComponentDashboardComponentTransferDataButtonComponent({
  business,
  setValue,
  saveBusiness,
}: BusinessModalComponentDashboardComponentTransferDataButtonComponentProps) {
  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClick = () => {
    setValue('receiverCompanyName', business.billingCompany);
    setValue('receiverName', business.billingName);
    setValue('receiverAddressOne', business.billingAddressOne);
    setValue('receiverAddressTwo', business.billingAddressTwo);
    setValue('receiverZipCode', business.billingZipCode);
    setValue('receiverCity', business.billingCity);
    setValue('receiverPhoneNumber', business.billingPhoneNumber);
    setValue('receiverEmail', business.billingEmail);
    saveBusiness();
  };

  return (
    <div className={styles.container}>
      <button onClick={onClick}>
        <FaArrowRight />
      </button>
    </div>
  );
}
