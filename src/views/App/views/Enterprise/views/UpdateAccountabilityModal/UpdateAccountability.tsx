import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import yup from 'yup';
import { updateEnterpriseAccountability } from '../../../../../../utils/api/enterpriseAccountability';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './UpdateAccountability.module.scss';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/update-accountability');

export default function AppViewEnterpriseViewUpdateAccountabilityModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const yupSchema = yup.object({
    billingServiceName: yup.string().nullable(),
    accountingEmail: yup.string().email('Format de mail invalide').nullable(),
    siren: yup
      .string()
      .matches(/\b\d{9}\b/, {
        message: 'Le numéro SIREN doit exactement avoir 9 caractères.',
        excludeEmptyString: true,
      })
      .when('category', {
        is: (category: CategoryClient | undefined) => !!category && [CategoryClient.DISTRIBUTEUR, CategoryClient.DISTRIBUTEUR_VVA].includes(category),
        then: (schema) => schema.required('Champs requis'),
        otherwise: (schema) => schema,
      }),
    vatNumber: yup.string().nullable(),
    discount: yup
      .number()
      .typeError('Format invalide')
      .min(0, 'Min 0')
      .max(
        currentUser.profile.categoryClient === CategoryClient.REPRESENTANT ? 40 : 100,
        currentUser.profile.categoryClient === CategoryClient.REPRESENTANT
          ? "Attention !! Remise supérieure à 40%, veuillez contacter VIZEO pour plus d'assistance."
          : 'Max 100',
      )
      .nullable(),
    accountNumber: yup.string().nullable(),
    category: yup.mixed<CategoryClient>().required('La catégorie est requise'),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      billingServiceName: enterprise.accountability?.billingServiceName,
      accountingEmail: enterprise.accountability?.accountingEmail,
      siren: enterprise.accountability?.siren,
      vatNumber: enterprise.accountability?.tvaNumber,
      discount: enterprise.accountability?.discount,
      accountNumber: enterprise.accountability?.accountNumber,
    },
  });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateEnterpriseAccountability(enterprise.accountability!, {
        billingServiceName: data.billingServiceName,
        tvaNumber: data.vatNumber,
        siren: data.siren,
        discount: data.discount,
        accountingEmail: data.accountingEmail,
        accountNumber: data.accountNumber,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprises._def });
      toast.success("Comptabilité de l'entreprise modifiée avec succès");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de la comptabilité de l'entreprise");
    },
  });

  useEffect(() => {
    setValue('category', enterprise.category);
  }, [enterprise.category]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Comptabilité et facturation</h6>
        </div>
        <div className={styles.form_container}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.card_container}>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_facturation_name">
                  Nom du service de facturation :
                </label>
                <input
                  type="text"
                  {...register('billingServiceName')}
                  placeholder="Nom du service de facturation"
                  autoCorrect="true"
                  id="company_facturation_name"
                />
                <p className={styles.__errors}>{errors.billingServiceName?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_email_comptable">
                  Email comptable :
                </label>
                <input type="email" {...register('accountingEmail')} placeholder="Email" id="company_email_comptable" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.accountingEmail?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_sirenNumber">
                  N° SIREN :
                </label>
                <input type="number" {...register('siren')} placeholder="N° SIREN" id="company_sirenNumber" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.siren?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_taxeNumber">
                  N° de TVA :
                </label>
                <input {...register('vatNumber')} type="text" placeholder="N° de TVA " id="company_taxeNumber" autoCorrect="true" autoComplete="off" />
                <p className={styles.__errors}>{errors.vatNumber?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_discount">
                  Remise
                </label>
                <input {...register('discount')} type="number" placeholder="Remise" id="company_discount" />
                <p className={styles.__errors}>{errors.discount?.message}</p>
              </div>
              <div className={styles.form__group}>
                <label className="label" htmlFor="company_accounting_account_number">
                  Numéro de compte comptable :
                </label>
                <input
                  {...register('accountNumber')}
                  type="text"
                  placeholder="Numéro de compte comptable"
                  id="company_accounting_account_number"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.__errors}>{errors.accountNumber?.message}</p>
              </div>
            </div>
            {isPending && (
              <div className={styles.form__request_loader}>
                <PropagateLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
            )}
            <div className={styles.step_buttons}>
              <button className="btn btn-primary" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary" style={{ marginLeft: '1rem' }} type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
