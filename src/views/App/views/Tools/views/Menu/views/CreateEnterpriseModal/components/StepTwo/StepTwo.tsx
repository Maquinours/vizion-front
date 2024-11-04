import { useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../../../components/Card/Card';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PropagateLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import { CreateEnterpriseStepOneDataType } from '../StepOne/StepOne';
import { useContext, useEffect } from 'react';
import { CreateEnterpriseContext } from '../../utils/contexts/context';
import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './StepTwo.module.scss';

const sirenRegex = /\b\d{9}\b/;

const routeApi = getRouteApi('/app/tools/menu/create-enterprise');

const yupSchema = yup.object().shape({
  billingServiceName: yup.string().nullable(),
  accountingEmail: yup.string().email('Format de mail invalide').nullable(),
  siren: yup
    .string()
    .matches(sirenRegex, {
      message: 'Le numéro SIREN doit exactement avoir 9 caractères.',
      excludeEmptyString: true,
    })
    .when('category', {
      is: (category: CategoryClient | undefined) => !!category && [CategoryClient.DISTRIBUTEUR, CategoryClient.DISTRIBUTEUR_VVA].includes(category),
      then: (schema) => schema.required('Champs requis'),
      otherwise: (schema) => schema,
    }),

  tvaNumber: yup.string().when('category', {
    is: (category: CategoryClient | undefined) => !!category && [CategoryClient.DISTRIBUTEUR, CategoryClient.DISTRIBUTEUR_VVA].includes(category),
    then: (schema) => schema.required('Champs requis'),
    otherwise: (schema) => schema.nullable(),
  }),
  discount: yup.number().typeError('Format invalide').min(0, 'Min 0').max(100, 'Max 100').nullable(),
  accountNumber: yup.string().nullable(),
  representative: yup.string().nullable(),
  relations: yup.array().of(yup.string().nullable()).required(),
  webSite: yup.string().nullable(),
  category: yup.mixed<CategoryClient>().required('La catégorie est requise'),
});

export type CreateEnterpriseStepTwoDataType = yup.InferType<typeof yupSchema>;

type AppViewToolsViewMenuViewCreateEnterpriseModalViewStepTwoComponentProps = Readonly<{
  stepOneData: CreateEnterpriseStepOneDataType | undefined;
  show: boolean;
  goToPreviousStep: () => void;
  onSubmit: (data: CreateEnterpriseStepTwoDataType) => void;
  isPending: boolean;
}>;
export default function AppViewToolsViewMenuViewCreateEnterpriseModalViewStepTwoComponent({
  stepOneData,
  show,
  goToPreviousStep,
  onSubmit,
  isPending,
}: AppViewToolsViewMenuViewCreateEnterpriseModalViewStepTwoComponentProps) {
  const { contacts } = useContext(CreateEnterpriseContext)!;

  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      relations: [],
    },
  });

  useEffect(() => {
    if (stepOneData) setValue('category', stepOneData.category);
  }, [stepOneData]);

  if (show)
    return (
      <div className={styles.forms_container}>
        <CardComponent title="Comptabilité et facturation">
          <div className={styles.card_container}>
            <div className={styles.form_group}>
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
              <p className={styles.errors}>{errors.billingServiceName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_email_comptable">
                Email comptable :
              </label>
              <input type="email" {...register('accountingEmail')} placeholder="Email" id="company_email_comptable" autoCorrect="true" autoComplete="off" />
              <p className={styles.errors}>{errors.accountingEmail?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_sirenNumber">
                N° SIREN :
              </label>
              <input type="number" {...register('siren')} placeholder="N° SIREN" id="company_sirenNumber" autoCorrect="true" autoComplete="off" />
              <p className={styles.errors}>{errors.siren?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_taxeNumber">
                N° de TVA :
              </label>
              <input {...register('tvaNumber')} type="text" placeholder="N° de TVA " id="company_taxeNumber" autoCorrect="true" autoComplete="off" />
              <p className={styles.errors}>{errors.tvaNumber?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_discount">
                Remise
              </label>
              <input {...register('discount')} type="number" placeholder="Remise" id="company_discount" />
              <p className={styles.errors}>{errors.discount?.message}</p>
            </div>
            <div className={styles.form_group}>
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
              <p className={styles.errors}>{errors.accountNumber?.message}</p>
            </div>
          </div>
        </CardComponent>
        <CardComponent title="Informations complémentaires">
          <div className={styles.card_container}>
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_representative">
                Représentant :
              </label>
              <select {...register('representative')} id="company_representative">
                {isLoadingRepresentatives ? <option value="">Chargement...</option> : <option value="">Sélectionner un représentant</option>}
                {representatives?.map((itm, idx) => (
                  <option key={idx} value={itm.id}>
                    {itm.name}
                  </option>
                ))}
              </select>
              <p className={styles.errors}>{errors.representative?.message}</p>
            </div>
            {[0, 1, 2].map((num) => (
              <div key={num} className={styles.form_group}>
                <label className="label" htmlFor={`company_relation_${num}`}>
                  En relation avec :
                </label>
                <input {...register(`relations.${num}`)} id={`company_relation_${num}`} />
                <p className={styles.errors}>{errors.relations?.at && errors.relations.at(num)?.message}</p>
              </div>
            ))}
            <div className={styles.form_group}>
              <label className="label" htmlFor="company_website">
                Site internet :
              </label>
              <input {...register('webSite')} type="tel" placeholder="Site internet" id="company_website" autoCorrect="true" autoComplete="off" />
              <p className={styles.errors}>{errors.webSite?.message}</p>
            </div>
          </div>
        </CardComponent>

        {contacts.length > 0 && (
          <Link
            from={routeApi.id}
            to="contacts"
            search={(old) => old}
            replace
            resetScroll={false}
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'var(--secondary-color)',
            }}
          >
            {contacts.length} contact ajouté{contacts.length > 1 ? 's' : ''}
          </Link>
        )}

        <div className={styles.loader}>
          <PropagateLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>
        <div className={styles.step_buttons}>
          <button className="btn btn-primary" onClick={() => goToPreviousStep()}>
            Précédent
          </button>
          <Link from={routeApi.id} to="add-contact" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
            Ajouter un contact
          </Link>
          <button className="btn btn-secondary" type="submit" onClick={handleSubmit(onSubmit)}>
            Terminer
          </button>
        </div>
      </div>
    );
}
