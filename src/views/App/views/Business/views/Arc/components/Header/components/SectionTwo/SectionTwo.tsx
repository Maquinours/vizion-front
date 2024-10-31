import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, getRouteApi, useBlocker } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CurrencyFormat from '../../../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { updateBusinessArc } from '../../../../../../../../../../utils/api/businessArcs';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import BusinessArcResponseDto from '../../../../../../../../../../utils/types/BusinessArcResponseDto';
import styles from './SectionTwo.module.scss';
import UnsavedChangesBlockingModalComponent from '../../../../../../../../../../components/UnsavedChangesBlockingModal/UnsavedChangesBlockingModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');
const routePath = '/app/businesses-rma/business/$businessId/arc';

const yupSchema = yup.object({
  documentName: yup.string().required('Le nom du document est requis !!'),
  orderNumber: yup.string().required('Le numéro de commande est requis !!'),
  clientTotalAmountHT: yup.number(),
});

export default function AppViewBusinessViewArcViewHeaderComponentSectionTwoComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();
  const { hideReferencesPrices } = routeApi.useSearch();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  const formDefaultValues = useMemo(
    () => ({ documentName: arc.documentName, orderNumber: arc.numOrder ?? '', clientTotalAmountHT: arc.amountHtConfirmed ?? 0 }),
    [arc.documentName, arc.numOrder, arc.amountHtConfirmed],
  );

  const {
    register,
    control,
    formState: { errors, isDirty },
    watch,
    reset: resetForm,
    getValues,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: formDefaultValues,
  });

  const formWarnings = useMemo(() => {
    const result: { clientTotalAmountHT?: string } = {};
    const clientTotalAmountHT = getValues('clientTotalAmountHT');
    if (clientTotalAmountHT === undefined) result.clientTotalAmountHT = 'Champs requis';
    else if (isNaN(clientTotalAmountHT)) result.clientTotalAmountHT = 'Entrez un nombre';
    else {
      const totalAmountHT = (arc.totalAmountHT ?? 0) + arc.shippingServicePrice;
      const absoluteDiffValue = Math.abs(clientTotalAmountHT - totalAmountHT);
      if (absoluteDiffValue > 1)
        result.clientTotalAmountHT = `Le montant total HT du client diffère de celui de l'ARC, Diff: ${absoluteDiffValue.toFixed(2)} €`;
    }
    return result;
  }, [watch('clientTotalAmountHT'), arc.totalAmountHT, arc.shippingServicePrice]);

  const { status, proceed, reset } = useBlocker({
    condition: isDirty,
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
      if (status === 'blocked') proceed();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'ARC");
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  useEffect(() => {
    resetForm(formDefaultValues, { keepDirtyValues: true });
  }, [formDefaultValues]);

  return (
    <>
      <div className={styles._two}>
        <form onSubmit={onSubmit}>
          <div className={styles.arc_details}>
            <div className={styles.form_group}>
              <label htmlFor="documentName">Nom du document</label>
              <div className={styles.form_input_save}>
                <input id="documentName" readOnly={!!business.archived} placeholder="ARC" {...register('documentName')} />
              </div>
              <p className={styles.__errors}>{errors.documentName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="orderNumber">Numéro de commande</label>
              <div className={styles.form_input_save}>
                <input id="orderNumber" readOnly={!!business.archived} placeholder="Numéro de commande" {...register('orderNumber')} />
              </div>
              <p className={styles.__errors}>{errors.orderNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="clientTotalAmountHT">Montant HT (+ fdp) pour contrôle</label>
              <div className={styles.form_input_save}>
                <Controller
                  control={control}
                  name="clientTotalAmountHT"
                  render={({ field: { value, onChange } }) => (
                    <CurrencyFormat
                      id="clientTotalAmountHT"
                      readOnly={!!business.archived}
                      placeholder="Montant HT (+ frais de port)"
                      displayType="input"
                      value={value}
                      onValueChange={(v) => onChange(Number(v.value) || 0)}
                    />
                  )}
                />
              </div>
              <p className={styles.__warnings}>{formWarnings.clientTotalAmountHT}</p>
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
            {!business.archived && (
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                {isPending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
              </button>
            )}
            <Link
              from={routePath}
              search={(prev) => ({ ...prev, hideReferencesPrices: !hideReferencesPrices })}
              replace
              resetScroll={false}
              ignoreBlocker
              className="btn btn-primary-light"
            >
              {hideReferencesPrices ? 'Afficher' : 'Masquer'} les références et prix
            </Link>
          </div>
        </form>
      </div>
      {status === 'blocked' && <UnsavedChangesBlockingModalComponent proceed={proceed} reset={reset} save={onSubmit} isSaving={isPending} />}
    </>
  );
}
