import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../utils/enums/BillType';
import BusinessBillDetailsResponseDto from '../../../../../../utils/types/BusinessBillDetailsResponseDto';
import styles from './Credit.module.scss';
import AppViewToolsViewCreditViewSearchSectionComponent from './components/SearchSection/SearchSections';
import AppViewToolsViewCreditViewTableComponent from './components/Table/Table';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import { CreditContext } from './utils/contexts/context';
import BusinessState from '../../../../../../utils/enums/BusinessState';

export type BusinessCreditRow = { detail: Partial<BusinessBillDetailsResponseDto>; quantity: number; price: number };
export type BusinessCreditDetails = {
  numBill: string;
  billNumBusiness: string;
  billNumOrder: string;
  billingCompany: EnterpriseResponseDto | undefined;
  billingContact: ProfileResponseDto | undefined;
  deliveryAddressCompanyName: string;
  deliveryAddressFullName: string;
  deliveryAddressOne: string;
  deliveryAddressTwo?: string | null;
  deliveryAddressZipCode: string;
  deliveryAddressCity: string;
  deliveryAddressEmail?: string | null;
  deliveryAddressPhoneNumber?: string | null;
};

const routeApi = getRouteApi('/app/tools/credit');

const yupSchema = yup.object().shape({
  shippingServicePrice: yup.number().required('Champs requis'),
});

export default function AppViewToolsViewCreditView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { serialNumber, businessNumber, orderNumber } = routeApi.useSearch();

  const [items, setItems] = useState<Array<BusinessCreditRow>>([]);
  const [details, setDetails] = useState<BusinessCreditDetails>();

  const { data: business, isLoading: isLoadingBusiness } = useQuery({
    ...queries.businesses.detail._ctx.byInfos({ serialNumber, businessNumber, orderNumber }),
    enabled: !!serialNumber || !!businessNumber || !!orderNumber,
  });

  const { data: bill, isLoading: isLoadingBills } = useQuery({
    ...queries['business-bills'].list._ctx.byBusinessId(business?.id ?? ''),
    enabled: business?.state === BusinessState.FACTURE,
    select: (data) => data.find((bill) => bill.type === BillType.FACTURE),
  });
  const { data: enterprise, isLoading: isLoadingEnterprise } = useQuery({
    ...queries.enterprise.detail(business?.enterpriseId ?? ''),
    enabled: !!business,
  });

  const { register, watch, getValues } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      shippingServicePrice: 0,
    },
  });

  const contextValue = useMemo(
    () => ({
      business,
      details,
      setDetails,
      shippingServicePrice: getValues('shippingServicePrice'),
      items,
      enterprise: details?.billingCompany ?? enterprise,
      bill,
    }),
    [business, details, setDetails, watch('shippingServicePrice'), items, enterprise, bill],
  );

  const addLine = () => {
    setItems((items) => [
      ...items,
      {
        detail: {
          id: uuidv4(),
          productReference: '',
          productDesignation: '',
          quantity: 0,
          unitPrice: 0,
        },
        quantity: 0,
        price: 0,
      },
    ]);
  };

  const onReset = () => {
    navigate({ search: (old) => ({ ...old, serialNumber: undefined, businessNumber: undefined, orderNumber: undefined }) });
  };

  useEffect(() => {
    setItems(bill?.billDetails.map((detail) => ({ detail, quantity: 0, price: 0 })) ?? []);
  }, [bill, setItems]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.first_grid}>
            <AppViewToolsViewCreditViewSearchSectionComponent isLoading={isLoadingBusiness || isLoadingBills || isLoadingEnterprise} />
            <div className={styles.header_buttons}>
              <button className="btn btn-primary" onClick={() => addLine()}>
                Ajouter une ligne
              </button>
              <Link from={routeApi.id} to="details" search={(old) => old} replace className="btn btn-secondary">
                {"Détails de l'avoir"}
              </Link>
            </div>
          </div>
          <AppViewToolsViewCreditViewTableComponent items={items} setItems={setItems} />
          <div className={styles.shipping_container}>
            <label htmlFor="shippingServicePrice">Frais de port (€) :</label>
            <input type="number" min={0} id="shippingServicePrice" {...register('shippingServicePrice', { valueAsNumber: true })} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary" onClick={onReset}>
              RAZ
            </button>
            <Link from={routeApi.id} to="show" search={(old) => old} replace className="btn btn-primary">
              Visualiser
            </Link>
          </div>
        </div>
      </div>
      <CreditContext.Provider value={contextValue}>
        <Outlet />
      </CreditContext.Provider>
    </>
  );
}
