import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { E164Number } from 'libphonenumber-js';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input/input';
import * as yup from 'yup';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './SearchSection.module.scss';

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
  const navigate = useNavigate({ from: Route.id });

  const { enterprise, contact, zipCode, city, phoneNumber, category, representativeId } = Route.useSearch();

  const { register, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: user } = useAuthentifiedUserQuery();

  const { data: representatives } = useQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const availableCategoryOptions = useMemo(
    () => categoryOptions.filter((item) => !item.allowedRoles || item.allowedRoles.some((role) => user.userInfo.roles.includes(role))),
    [user.userInfo.roles],
  );

  const onSubmit = useCallback(
    ({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId }: yup.InferType<typeof yupSchema>) => {
      navigate({
        search: (old) => ({
          ...old,
          enterprise: enterprise || undefined,
          contact: contact || undefined,
          zipCode: zipCode || undefined,
          city: city || undefined,
          phoneNumber: phoneNumber || undefined,
          category: category || undefined,
          representativeId: representativeId || undefined,
          page: undefined,
          size: undefined,
        }),
        replace: true,
      });
    },
    [navigate],
  );

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      navigate({
        search: (old) => ({
          ...old,
          enterprise: undefined,
          contact: undefined,
          zipCode: undefined,
          city: undefined,
          phoneNumber: undefined,
          category: undefined,
          representativeId: undefined,
          page: undefined,
          size: undefined,
        }),
        replace: true,
      });
    },
    [navigate],
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
        <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
          <input placeholder="Entreprise/Enseigne" id="enterprise" {...register('enterprise')} />
          <input placeholder="Contact/Agence" id="contact" {...register('contact')} />
          <input placeholder="Code postal" id="zipCode" {...register('zipCode')} />
          <input placeholder="Ville" id="city" {...register('city')} />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <PhoneInput
                value={value ? (value as E164Number) : undefined}
                onChange={onChange}
                onBlur={onBlur}
                id="phoneNumber"
                country="FR"
                placeholder="Numéro de téléphone"
              />
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
          <button type="submit" className="btn btn-secondary">
            Rechercher
          </button>
          <button type="reset" className="btn btn-primary">
            Réinitialiser
          </button>
        </form>
      </div>
    </div>
  );
}
