import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input/input';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AllBusinessState from '../../../../../../utils/enums/AllBusinessState';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/businesses-rma');

const yupSchema = yup.object().shape({
  number: yup.string(),
  numOrder: yup.string(),
  name: yup.string(),
  contact: yup.string(),
  deliverPhoneNumber: yup.string(),
  zipCode: yup.string(),
  representative: yup.string(),
  installer: yup.string(),
  enterpriseName: yup.string(),
  state: yup.mixed<AllBusinessState>().oneOf(Object.values(AllBusinessState)),
  dates: yup.array().of(yup.date().required().nullable()).min(2).max(2).required(),
  excludeds: yup
    .array()
    .of(yup.mixed<CategoryClient>().oneOf(Object.values(CategoryClient)).required())
    .required(),
});

const STATE_OPTIONS = [
  {
    label: 'Tous les états',
    value: '',
  },
  {
    label: 'Créée',
    value: AllBusinessState.CREATED,
  },
  {
    label: 'Devis',
    value: AllBusinessState.DEVIS,
  },
  {
    label: 'Arc',
    value: AllBusinessState.ARC,
  },
  {
    label: 'BP',
    value: AllBusinessState.BP,
  },
  {
    label: 'BL',
    value: AllBusinessState.BL,
  },
  {
    label: 'Facture',
    value: AllBusinessState.FACTURE,
  },
  {
    label: 'Archivée',
    value: AllBusinessState.ARCHIVE,
    allowedRoles: ['ROLE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO', 'ROLE_REPRESENTANT_VIZEO'],
  },
  {
    label: 'RMA Prise en charge',
    value: AllBusinessState.PRISE_EN_CHARGE,
  },
  {
    label: 'RMA Réception',
    value: AllBusinessState.RECEPTION,
  },
  {
    label: 'RMA Analyse',
    value: AllBusinessState.ANALYSE_REPARATION_EXPEDITION,
  },
];

const CATEGORY_OPTIONS = [
  {
    label: 'Vizeo',
    value: CategoryClient.VIZEO,
  },
  {
    label: 'Fournisseur',
    value: CategoryClient.FOURNISSEUR,
  },
  {
    label: 'Représentant',
    value: CategoryClient.REPRESENTANT,
  },

  {
    label: "Bureau d'etude",
    value: CategoryClient.BUREAU_ETUDE,
  },
  {
    label: 'Distributeur',
    value: CategoryClient.DISTRIBUTEUR,
  },
  {
    label: 'Distributeur VVA',
    value: CategoryClient.DISTRIBUTEUR_VVA,
  },
  {
    label: 'Installateur',
    value: CategoryClient.INSTALLATEUR,
  },
  {
    label: 'Client',
    value: CategoryClient.CLIENT,
  },
];

export default function AppViewBusinessesRmaViewSearchSectionComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const { numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, enterpriseName, state, dates, excludeds } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery({
    ...queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT),
    enabled: user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
  });

  const { register, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      dates: [null, null],
      excludeds: [],
    },
  });

  const stateOptions = useMemo(
    () => STATE_OPTIONS.filter((opt) => !opt.allowedRoles || opt.allowedRoles.some((role) => user.userInfo.roles.includes(role))),
    [STATE_OPTIONS, user],
  );

  const onSubmit = ({
    number,
    numOrder,
    name,
    contact,
    deliverPhoneNumber,
    zipCode,
    representative,
    installer,
    enterpriseName,
    state,
    dates,
    excludeds,
  }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: (old) => ({
        ...old,
        number,
        numOrder,
        name,
        contact,
        deliverPhoneNumber,
        zipCode,
        representative: representative,
        installer,
        enterpriseName,
        state,
        dates,
        excludeds,
        page: 0,
      }),
    });
  };

  const onReset = () => {
    navigate({
      search: (old) => ({
        ...old,
        number: undefined,
        numOrder: undefined,
        name: undefined,
        contact: undefined,
        deliverPhoneNumber: undefined,
        zipCode: undefined,
        representative: undefined,
        installer: undefined,
        enterpriseName: undefined,
        state: undefined,
        dates: undefined,
        excludeds: undefined,
        page: 0,
      }),
    });
  };

  useEffect(() => {
    setValue('numOrder', numOrder);
    setValue('name', name);
    setValue('contact', contact);
    setValue('deliverPhoneNumber', deliverPhoneNumber);
    setValue('zipCode', zipCode);
    setValue('representative', representatives?.find((rep) => rep.id === representative)?.id);
    setValue('installer', installer);
    setValue('enterpriseName', enterpriseName);
    setValue('state', state);
    setValue('dates', dates);
    setValue('excludeds', excludeds);
  }, [dates]);

  useEffect(() => {
    if (representatives) setValue('representative', representatives.find((rep) => rep.id === representative)?.id);
  }, [isLoadingRepresentatives]);

  return (
    <div className={styles.filters_container}>
      <div className={styles._title}>
        <h5>Filtres</h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={() => onReset()}>
        <div className={styles.inputs_container}>
          <Controller
            control={control}
            name="dates"
            render={({ field: { value, onChange } }) => (
              <ReactDatePicker
                selectsRange={true}
                onChange={onChange}
                startDate={value.at(0)}
                endDate={value.at(1)}
                allowSameDay
                withPortal
                closeOnScroll={true}
                locale="fr"
                dateFormat="dd/MM/yyyy"
                placeholderText="Date de modification"
                isClearable={true}
              />
            )}
          />

          <input placeholder="Numéro d'affaire" id="businessNumber" {...register('number')} />
          {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
            <input placeholder="Nom de l'entreprise" id="enterpriseName" {...register('enterpriseName')} />
          )}
          <input placeholder="Nom de l'affaire" id="businessName" {...register('name')} />
          <input placeholder="Nom du contact" id="businessContact" {...register('contact')} />
          <input placeholder="Installateur" id="installer" {...register('installer')} />
          <input placeholder="Numéro de commande" id="businessNumOrder" {...register('numOrder')} />
          <input placeholder="Code Postal de livraison" id="zipCode" {...register('zipCode')} />
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <select id="representative" {...register('representative')}>
              {isLoadingRepresentatives ? (
                <option value="">Chargement...</option>
              ) : (
                <>
                  <option value="">Choisir un représentant</option>
                  {representatives?.map((representative) => (
                    <option key={representative.id} value={representative.id}>
                      {representative.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          )}
          <select id="state" {...register('state')} defaultValue="">
            {stateOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <Controller
            name="deliverPhoneNumber"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PhoneInput value={value} onChange={onChange} id="businessDeliverPhoneNumber" country="FR" placeholder="Numéro de téléphone du client" />
            )}
          />
        </div>
        <div className={styles.search_buttons}>
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <div className={styles.react_select}>
              <Controller
                control={control}
                name="excludeds"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    placeholder="Catégories à exclure"
                    options={CATEGORY_OPTIONS}
                    isMulti
                    value={CATEGORY_OPTIONS.filter((opt) => value.some((val) => val === opt.value))}
                    onChange={(e) => onChange(e.map((opt) => opt.value))}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: '#f2f3f8',
                        border: 1,
                        color: 'black',
                        minWidth: 300,
                        '::placeholder': {
                          ...styles['::placeholder'],
                          color: 'red',
                        },
                      }),
                    }}
                  />
                )}
              />
            </div>
          )}
          <div>
            <button className="btn btn-primary-light" type="reset">
              RAZ
            </button>
            <button className="btn btn-primary" type="submit">
              Rechercher
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
