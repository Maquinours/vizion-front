import { useForm } from 'react-hook-form';
import styles from './SectionTwo.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessArcResponseDto from '../../../../../../../../../../utils/types/BusinessArcResponseDto';
import { updateBusinessArc } from '../../../../../../../../../../utils/api/businessArcs';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

const yupSchema = yup.object({
  documentName: yup.string().required('Le nom du document est requis !!'),
  orderNumber: yup.string().required('Le numéro de commande est requis !!'),
  totalAmountHT: yup.number().required(), // USED TO handle clientTotalAmountHT
  clientTotalAmountHT: yup
    .number()
    .transform((_value, originalValue) => (typeof originalValue === 'string' ? Number(originalValue.replace(/,/, '.')) : originalValue))
    .typeError('Entrer un nombre')
    .required('Champs requis')
    .test({
      name: 'equalOrDifferentByOne',
      skipAbsent: false,
      test(value) {
        const absoluteDiffValue = Math.abs(value - (yup.ref('totalAmountHT') as unknown as number));
        if (absoluteDiffValue < 0 || absoluteDiffValue > 1)
          return this.createError({ message: `Le montant total HT du client diffère de celui de l'ARC, Diff: ${absoluteDiffValue} €` });
        return true;
      },
    }),
});

export default function AppViewBusinessViewArcViewHeaderComponentSectionTwoComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();
  const { hideReferencesPrices } = routeApi.useSearch();

  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      documentName: arc.documentName,
      orderNumber: arc.numOrder ?? '',
      clientTotalAmountHT: arc.amountHtConfirmed ?? 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateBusinessArc(arc.id, {
        number: arc.number,
        documentName: data.documentName,
        shippingServicePrice: arc.shippingServicePrice,
        vat: arc.vat,
        numOrder: data.orderNumber,
        totalAmount: arc.totalAmount,
        totalAmountHT: arc.totalAmountHT,
        businessId: businessId,
        bom: arc.bom,
        amountHtConfirmed: data.clientTotalAmountHT,
        shippingPriceConfirmed: arc.shippingPriceConfirmed,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries['business-ARCs']._def });
      queryClient.setQueryData<BusinessArcResponseDto>(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey, data);
      toast.success('ARC mis à jour avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'ARC");
    },
  });

  useEffect(() => {
    setValue('totalAmountHT', arc.totalAmountHT ?? 0);
  }, [arc.totalAmountHT]);

  return (
    <div className={styles._two}>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className={styles.arc_details}>
          <div className={styles.form_group}>
            <label htmlFor="documentName">Nom du document</label>
            <div className={styles.form_input_save}>
              <input id="documentName" placeholder="ARC" {...register('documentName')} />
            </div>
            <p className={styles.__errors}>{errors.documentName?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="orderNumber">Numéro de commande</label>
            <div className={styles.form_input_save}>
              <input id="orderNumber" placeholder="Numéro de commande" {...register('orderNumber')} />
            </div>
            <p className={styles.__errors}>{errors.orderNumber?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label htmlFor="clientTotalAmountHT">Montant HT (+ fdp)</label>
            <div className={styles.form_input_save}>
              <input id="clientTotalAmountHT" placeholder="Montant HT (+ frais de port)" {...register('clientTotalAmountHT')} />
            </div>
            <p className={styles.__errors}>{errors.clientTotalAmountHT?.message}</p>
          </div>
          {/* <div className={styles.form_group}>
                              <label htmlFor="clientShippingPrice">
                                Frais de port (Client)
                              </label>
                              <div className={styles.form_input_save}>
                                <input
                                  name="clientShippingPrice"
                                  id="clientShippingPrice"
                                  placeholder="Frais de port client"
                                  {...registerArcInfo("clientShippingPrice")}
                                />
                              </div>
                              <p className={styles.__errors}>
                                {arcErrors.clientShippingPrice?.message}
                              </p>
                            </div> */}
        </div>
        <div className={styles.actions_container}>
          <button type="submit" disabled={isPending} className="btn btn-secondary">
            {isPending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
          </button>
          <Link from={routeApi.id} search={(prev) => ({ ...prev, hideReferencesPrices: !hideReferencesPrices })} replace className="btn btn-primary-light">
            {hideReferencesPrices ? 'Afficher' : 'Masquer'} les références et prix
          </Link>
        </div>
      </form>
    </div>
  );
}
