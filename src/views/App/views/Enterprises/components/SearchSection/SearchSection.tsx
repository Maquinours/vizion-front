import * as yup from 'yup';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './SearchSection.module.scss';
import { useQuery } from '@tanstack/react-query';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { useEffect, useMemo } from 'react';
import PhoneInput from 'react-phone-number-input/input';
import { Link, getRouteApi } from '@tanstack/react-router';

const Route = getRouteApi('/app/enterprises');

const categoryOptions = [
  {
    label: 'Toutes les catégories',
    value: '',
  },
  {
    label: 'VIZEO',
    value: CategoryClient.VIZEO,
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    label: 'Distributeur',
    value: CategoryClient.DISTRIBUTEUR,
    allowedRoles: ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'],
  },
  {
    label: 'Distributeur VVA',
    value: CategoryClient.DISTRIBUTEUR_VVA,
    allowedRoles: ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'],
  },
  {
    label: 'Installateur',
    value: CategoryClient.INSTALLATEUR,
  },
  {
    label: 'Représentant',
    value: CategoryClient.REPRESENTANT,
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    label: "Bureau d'études",
    value: CategoryClient.BUREAU_ETUDE,
  },
  {
    label: 'Fournisseur',
    value: CategoryClient.FOURNISSEUR,
    allowedRoles: ['ROLE_MEMBRE_VIZEO'],
  },
  {
    label: 'Client',
    value: CategoryClient.CLIENT,
  },
];

const yupSchema = yup.object({
  enterprise: yup.string(),
  contact: yup.string(),
  zipCode: yup.string(),
  city: yup.string(),
  phoneNumber: yup.string(),
  category: yup.mixed<CategoryClient>(),
  representativeId: yup.string(),
});

export default function AppViewEnterprisesViewSearchSectionComponent() {
  const { enterprise, contact, zipCode, city, phoneNumber, category, representativeId } = Route.useSearch();

  const { register, control, watch, setValue } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: user } = useAuthentifiedUserQuery();

  const { data: representatives } = useQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const availableCategoryOptions = useMemo(
    () => categoryOptions.filter((item) => !item.allowedRoles || item.allowedRoles.some((role) => user.userInfo.roles.includes(role))),
    [user.userInfo.roles],
  );

  useEffect(() => {
    setValue('enterprise', enterprise);
    setValue('contact', contact);
    setValue('zipCode', zipCode);
    setValue('city', city);
    setValue('phoneNumber', phoneNumber);
    setValue('category', category);
    setValue('representativeId', representativeId);
  }, [setValue, enterprise, contact, zipCode, city, phoneNumber, category, representativeId]);

  return (
    <div className={styles.container}>
      <div className={styles.main_label}>
        <h6>Filtres</h6>
      </div>

      <div className={styles.inputs}>
        <form>
          <input placeholder="Entreprise/Enseigne" id="enterprise" {...register('enterprise')} />
          <input placeholder="Contact/Agence" id="contact" {...register('contact')} />
          <input placeholder="Code postal" id="zipCode" {...register('zipCode')} />
          <input placeholder="Ville" id="city" {...register('city')} />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <PhoneInput value={value} onChange={onChange} onBlur={onBlur} id="phoneNumber" country="FR" placeholder="Numéro de téléphone" />
            )}
          />
          <select id="category" {...register('category')} defaultValue="">
            {availableCategoryOptions.map((itm) => (
              <option key={itm.value} value={itm.value}>
                {itm.label}
              </option>
            ))}
          </select>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <select id="representativeId" {...register('representativeId')}>
              <option value="">Choisir un représentant</option>
              {representatives?.map((itm) => (
                <option key={itm.id} value={itm.id}>
                  {itm.name}
                </option>
              ))}
            </select>
          )}
          <Link
            from={Route.id}
            search={(old) => ({
              ...old,
              enterprise: watch('enterprise') || undefined,
              contact: watch('contact') || undefined,
              zipCode: watch('zipCode') || undefined,
              city: watch('city') || undefined,
              phoneNumber: watch('phoneNumber') || undefined,
              category: watch('category') || undefined,
              representativeId: watch('representativeId') || undefined,
              page: 0,
              size: 20,
            })}
            className="btn btn-secondary"
          >
            Rechercher
          </Link>
          <Link
            from={Route.id}
            search={(old) => ({
              ...old,
              enterprise: undefined,
              contact: undefined,
              zipCode: undefined,
              city: undefined,
              phoneNumber: undefined,
              category: undefined,
              representativeId: undefined,
              page: 0,
              size: 20,
            })}
            className="btn btn-primary"
          >
            Réinitialiser
          </Link>
        </form>
      </div>
    </div>
  );
}
