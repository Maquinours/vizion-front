import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import * as yup from 'yup';
import { productSerialNumberQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSerialNumber';
import { getSerialNumberDataByNumberAndCategory } from '../../../../../../../../utils/api/productSerialNumber';
import styles from './CreateModal.module.scss';
import { useEffect } from 'react';
import { ddns } from '../../../../../../../../utils/constants/queryKeys/ddns';
import { createDdns } from '../../../../../../../../utils/api/ddns';
import { toast } from 'react-toastify';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { businesses } from '../../../../../../../../utils/constants/queryKeys/business';
import ProductSerialNumberResponseDto from '../../../../../../../../utils/types/ProductSerialNumberResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';

const routeApi = getRouteApi('/app/tools/ddns/create');

const yupSchema = yup.object({
  domain: yup.string().required('Le domaine est requis'),
  productSerialNumber: yup.string(),
  productReference: yup.string(),
});

export default function AppViewToolsViewDdnsViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const productSerialNumber = watch('productSerialNumber');
  const domain = watch('domain');

  const { data: user } = useAuthentifiedUserQuery();

  const {
    data: serialNumber,
    isFetching: isSerialNumberFetching,
    refetch: refetchSerialNumber,
  } = useQuery({
    queryKey: productSerialNumberQueryKeys.dataByCategoryAndNumber('NVR', productSerialNumber!),
    queryFn: () => getSerialNumberDataByNumberAndCategory('NVR', productSerialNumber!),
    enabled: false,
  });

  const {
    data: domainExists,
    isFetching: isDomainExistsFetching,
    refetch: refetchDomainExists,
  } = useQuery({
    ...ddns.exists(domain),
    enabled: false,
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ domain, productSerialNumber }: yup.InferType<typeof yupSchema>) => {
      const { serialNumber, business } = await (async () => {
        try {
          const result: { serialNumber: ProductSerialNumberResponseDto | undefined; business: BusinessResponseDto | undefined } = {
            serialNumber: undefined,
            business: undefined,
          };
          if (!productSerialNumber) return result;
          const serialNumber = await queryClient.ensureQueryData({
            queryKey: productSerialNumberQueryKeys.dataByCategoryAndNumber('NVR', productSerialNumber!),
            queryFn: () => getSerialNumberDataByNumberAndCategory('NVR', productSerialNumber!),
          });
          if (!serialNumber.serialNumber || !serialNumber.category || !serialNumber.vizeo || !serialNumber.serialNumber.businessId) return result;
          result.serialNumber = serialNumber.serialNumber!;
          const business = await queryClient.ensureQueryData(businesses.detail(serialNumber.serialNumber!.businessId!));
          result.business = business;
          return result;
        } catch (error) {
          console.error(error);
          return { business: undefined, serialNumber: undefined };
        }
      })();

      return createDdns({
        ip: '0.0.0.0',
        enterpriseId: business?.enterpriseId,
        enterpriseName: business?.enterpriseName,
        profileId: user.profile.id,
        profileName: `${user.profile.firstName} ${user.profile.lastName}`,
        domainName: domain,
        email: business?.billingEmail,
        productReference: serialNumber?.productRef,
        productSerialNumber: serialNumber?.serialNumber,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ddns._def });
      toast.success('Le DDNS a été créé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du DDNS');
    },
  });

  useEffect(() => {
    if (isSerialNumberFetching || !serialNumber) return;
    if (!serialNumber.serialNumber) {
      toast.warning('Numéro de série inexistant');
    } else if (!serialNumber.category || !serialNumber.vizeo) {
      let text = "Le produit ayant ce numéro de série n'est pas";
      if (!serialNumber.category) {
        text += ' un NVR';
        if (!serialNumber.vizeo) text += " et n'est pas de VIZEO";
      } else text += 'de VIZEO';
      toast.warning(text);
    } else if (!serialNumber.serialNumber!.businessId) toast.warning('Numéro de série non associé à une affaire');
    else setValue('productReference', serialNumber.serialNumber!.productVersionRef ?? undefined);
  }, [isSerialNumberFetching]);

  useEffect(() => {
    if (isDomainExistsFetching || domainExists === undefined) return;
    if (domainExists === true) toast.warning('DDNS déjà utilisé');
    else toast.success('DDNS disponible');
  }, [isDomainExistsFetching]);

  console.log(isSerialNumberFetching, isDomainExistsFetching, isPending);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Ajouter un DDNS</p>
        </div>

        <div className={styles.form}>
          <div className={styles.form_group_one}>
            <label className={styles.label} htmlFor="domainName">
              URL :
            </label>
            <input type="text" {...register('domain')} id="domainName" />
            <p className={styles.text_end}>.vizeo.fr</p>
            <p className={styles.__errors}>{errors.domain?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productSerialNumber">
              Numéro de série :
            </label>
            <input type="text" {...register('productSerialNumber')} name="productSerialNumber" id="productSerialNumber" />
            <p className={styles.__errors}>{errors.productSerialNumber?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productReference">
              Référence :
            </label>
            <input type="text" {...register('productReference')} name="productReference" id="productReference" readOnly />
            <p className={styles.__errors}>{errors.productReference?.message}</p>
          </div>

          <div className={styles.form__loader}>
            <PulseLoader color="#31385A" loading={isSerialNumberFetching || isDomainExistsFetching || isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.form__buttons}>
            <button className="btn btn-primary" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={() => refetchDomainExists()}>
              Tester
            </button>
            <button className="btn btn-secondary" onClick={() => refetchSerialNumber()} disabled={domainExists}>
              Vérifier numéro
            </button>
            <button className="btn btn-secondary" disabled={domainExists} onClick={handleSubmit((data) => mutate(data))}>
              Créer DDNS
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
