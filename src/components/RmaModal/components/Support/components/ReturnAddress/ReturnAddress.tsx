import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateRma } from '../../../../../../utils/api/rma';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../../utils/enums/AssistanceState';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import styles from './ReturnAddress.module.scss';
import CardComponent from '../../../../../Card/Card';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

const yupSchema = yup.object().shape({
  addressCompanyName: yup.string().required('Champs requis.'),
  addressName: yup.string().required('Champs requis.'),
  addressTwo: yup.string().nullable(),
  addressOne: yup.string().required('Champs requis.'),
  addressZipCode: yup.string().required('Champs requis.'),
  addressCity: yup.string().required('Champs requis.'),
  addressPhone: yup.string().nullable(),
  addressEmail: yup.string().email('Email invalide').nullable(),
  installerProfileName: yup.string().nullable(),
});

type RmaModalComponentSupportComponentReturnAddressComponentProps = Readonly<{
  rma: AssistanceResponseDto;
}>;
export default function RmaModalComponentSupportComponentReturnAddressComponent({ rma }: RmaModalComponentSupportComponentReturnAddressComponentProps) {
  const queryClient = useQueryClient();

  // const { rmaId } = routeApi.useParams();

  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      addressCompanyName: '',
      addressName: '',
      addressTwo: '',
      addressOne: '',
      addressZipCode: '',
      addressCity: '',
      addressPhone: '',
      addressEmail: '',
      installerProfileName: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      addressCompanyName,
      addressName,
      addressOne,
      addressTwo,
      addressZipCode,
      addressCity,
      addressPhone,
      addressEmail,
      installerProfileName,
    }: yup.InferType<typeof yupSchema>) =>
      updateRma(rma.id, {
        number: rma.number,
        addressCompanyName,
        addressName,
        addressOne,
        addressTwo,
        addressZipCode,
        addressCity,
        addressPhone,
        addressEmail,
        enterpriseId: rma.enterpriseId,
        enterpriseName: rma.enterpriseName,
        installerProfileName,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queries.rmas.detail(rma.id).queryKey, data);
      toast.success('Adresse de retour modifiée avec succès.');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'adresse de retour.");
    },
  });

  useEffect(() => {
    setValue('addressCompanyName', rma.addressCompanyName ?? '');
    setValue('addressName', rma.addressName ?? '');
    setValue('addressOne', rma.addressOne ?? '');
    setValue('addressTwo', rma.addressTwo ?? '');
    setValue('addressZipCode', rma.addressZipCode ?? '');
    setValue('addressCity', rma.addressCity ?? '');
    setValue('addressPhone', rma.addressPhone ?? '');
    setValue('addressEmail', rma.addressEmail ?? '');
    setValue('installerProfileName', rma.installerProfileName ?? '');
  }, [rma.id]);

  return (
    <div className={styles.container}>
      <CardComponent title="Adresse retour">
        <div className={styles.content}>
          <div className={styles.form_container}>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <div className={styles.form_group}>
                <label htmlFor="receiverCompanyName">Société :</label>
                <input {...register('addressCompanyName')} id="receiverCompanyName" type="text" />
                <p className={styles.__errors}>{errors.addressCompanyName?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverName">Nom :</label>
                <input {...register('addressName')} id="receiverName" type="text" />
                <p className={styles.__errors}>{errors.addressName?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverAddressOne">Adresse 1:</label>
                <input id="receiverAddressOne" {...register('addressOne')} type="text" />
                <p className={styles.__errors}>{errors.addressOne?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverAddressTwo">Adresse 2 :</label>
                <input {...register('addressTwo')} id="receiverAddressTwo" type="text" />
                <p className={styles.__errors}>{errors.addressTwo?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverZipCode">CP :</label>
                <input {...register('addressZipCode')} id="receiverZipCode" type="text" />
                <p className={styles.__errors}>{errors.addressZipCode?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverCity">Ville :</label>
                <input {...register('addressCity')} id="receiverCity" type="text" />
                <p className={styles.__errors}>{errors.addressCity?.message}</p>
              </div>
              <hr />
              <div className={styles.form_group}>
                <label htmlFor="receiverPhoneNumber">Téléphone :</label>
                <input {...register('addressPhone')} id="receiverPhoneNumber" type="tel" />
                <p className={styles.__errors}>{errors.addressPhone?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="receiverEmail">Mail :</label>
                <input type="email" {...register('addressEmail')} id="receiverEmail" />
                <p className={styles.__errors}>{errors.addressEmail?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="installerProfileName">Info tableau affaires :</label>
                <input type="text" {...register('installerProfileName')} id="installerProfileName" />
                <p className={styles.__errors}>{errors.installerProfileName?.message}</p>
              </div>
              <div className={styles.form__loader}>
                <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
              <div className={styles.submit_button}>
                {rma.state !== AssistanceState.ARCHIVE && (
                  <button className="btn btn-primary" type="submit">
                    Valider adresse de retour
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
