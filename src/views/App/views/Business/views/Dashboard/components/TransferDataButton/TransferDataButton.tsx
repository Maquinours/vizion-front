import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { FaArrowRight } from 'react-icons/fa';
import styles from './TransferDataButton.module.scss';
import { UseFormSetValue } from 'react-hook-form';
import { BusinessDashboardFormType } from '../../Dashboard';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId');

type AppViewBusinessViewDashboardViewTransferDataButtonComponentProps = Readonly<{
  setValue: UseFormSetValue<BusinessDashboardFormType>;
}>;
export default function AppViewBusinessViewDashboardViewTransferDataButtonComponent({
  setValue,
}: AppViewBusinessViewDashboardViewTransferDataButtonComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const onClick = () => {
    setValue('receiverCompanyName', business.billingCompany);
    setValue('receiverName', business.billingName);
    setValue('receiverAddressOne', business.billingAddressOne);
    setValue('receiverAddressTwo', business.billingAddressTwo);
    setValue('receiverZipCode', business.billingZipCode);
    setValue('receiverCity', business.billingCity);
    setValue('receiverPhoneNumber', business.billingPhoneNumber);
    setValue('receiverEmail', business.billingEmail);
  };

  return (
    <div className={styles.container}>
      <button onClick={onClick}>
        <FaArrowRight />
      </button>
    </div>
  );
}
