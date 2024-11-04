import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../utils/enums/BillType';
import BusinessBillDetailsResponseDto from '../../../../../../utils/types/BusinessBillDetailsResponseDto';
import BusinessBillResponseDto from '../../../../../../utils/types/BusinessBillResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import styles from './Credit.module.scss';
import AppViewToolsViewCreditViewSearchSectionComponent from './components/SearchSection/SearchSections';
import AppViewToolsViewCreditViewTableComponent from './components/Table/Table';
import { CreditContext } from './utils/contexts/context';

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
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { serialNumber, businessNumber } = routeApi.useSearch();

  const [business, setBusiness] = useState<BusinessResponseDto>();
  const [bill, setBill] = useState<BusinessBillResponseDto>();
  const [enterprise, setEnterprise] = useState<EnterpriseResponseDto>();

  const [items, setItems] = useState<Array<BusinessCreditRow>>([]);
  const [details, setDetails] = useState<BusinessCreditDetails>();

  const { mutate: search, isPending: isSearching } = useMutation({
    mutationFn: async () => {
      const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byInfos({ serialNumber, businessNumber }));
      const billPromise = queryClient
        .ensureQueryData(queries['business-bills'].list._ctx.byBusinessId(business.id))
        .then((data) => data.find((bill) => bill.type === BillType.FACTURE));
      const enterprisePromise = queryClient.ensureQueryData(queries.enterprise.detail(business.enterpriseId));
      return {
        business,
        bill: await billPromise,
        enterprise: await enterprisePromise,
      };
    },
    onMutate: () => {
      setBusiness(undefined);
      setBill(undefined);
      setEnterprise(undefined);
      setItems([]);
    },
    onSuccess: (data) => {
      if (data.bill) {
        setBusiness(data.business);
        setBill(data.bill);
        setEnterprise(data.enterprise);
        setItems(data.bill.billDetails.map((detail) => ({ detail, quantity: 0, price: 0 })));
      } else toast.error("Aucune facture n'a été trouvée pour cette affaire");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) toast.error('Aucune affaire correspondante');
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de la recherche de l'affaire");
      }
    },
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
    navigate({ search: (old) => ({ ...old, serialNumber: undefined, businessNumber: undefined }), replace: true, resetScroll: false });
  };

  useEffect(() => {
    if (!!serialNumber || !!businessNumber) search();
  }, [serialNumber, businessNumber]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.first_grid}>
            <AppViewToolsViewCreditViewSearchSectionComponent isLoading={isSearching} />
            <div className={styles.header_buttons}>
              <button className="btn btn-primary" onClick={() => addLine()}>
                Ajouter une ligne
              </button>
              <Link from={routeApi.id} to="details" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
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
            <Link from={routeApi.id} to="show" search={(old) => old} replace resetScroll={false} className="btn btn-primary">
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
