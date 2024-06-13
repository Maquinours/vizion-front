import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import 'react-datepicker/dist/react-datepicker.css';
import { Range, getTrackBackground } from 'react-range';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import { ClickAwayListener } from '@mui/material';
import { E164Number } from 'libphonenumber-js';
import { UserRole } from '../../../../../../utils/types/ProfileInfoResponseDto';

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
  amounts: yup.array().of(yup.number().required()).length(2).required(),
  enterpriseName: yup.string(),
  state: yup.mixed<AllBusinessState>().oneOf(Object.values(AllBusinessState)),
  dates: yup.array().of(yup.date().required().nullable()).min(2).max(2).required(),
  excludeds: yup
    .array()
    .of(yup.mixed<CategoryClient>().oneOf(Object.values(CategoryClient)).required())
    .required(),
  fuzzy: yup.boolean().required(),
});

const STATE_OPTIONS: Array<{ label: string; value: AllBusinessState | ''; allowedRoles?: Array<UserRole> }> = [
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
    allowedRoles: ['ROLE_MEMBRE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO', 'ROLE_REPRESENTANT'],
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

  const { numOrder, name, contact, deliverPhoneNumber, zipCode, representative, installer, amounts, enterpriseName, state, dates, excludeds, fuzzy } =
    routeApi.useSearch();

  const [showAmounts, setShowAmounts] = useState(false);

  const { data: user } = useAuthentifiedUserQuery();

  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery({
    ...queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT),
    enabled: user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
  });

  const { register, control, setValue, resetField, reset, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      dates: [null, null],
      amounts: [0, 80_000],
      excludeds: [CategoryClient.FOURNISSEUR],
      fuzzy: true,
    },
  });

  const stateOptions = useMemo(
    () => STATE_OPTIONS.filter((opt) => !opt.allowedRoles || opt.allowedRoles.some((role) => user.userInfo.roles.includes(role))),
    [STATE_OPTIONS, user],
  );

  const onSubmit = useCallback(
    ({
      number,
      numOrder,
      name,
      contact,
      deliverPhoneNumber,
      zipCode,
      representative,
      installer,
      amounts,
      enterpriseName,
      state,
      dates,
      excludeds,
      fuzzy,
    }: yup.InferType<typeof yupSchema>) => {
      navigate({
        search: (old) => ({
          ...old,
          number: number || undefined,
          numOrder: numOrder || undefined,
          name: name || undefined,
          contact: contact || undefined,
          deliverPhoneNumber: deliverPhoneNumber || undefined,
          zipCode: zipCode || undefined,
          representative: representative || undefined,
          amounts,
          installer: installer || undefined,
          enterpriseName: enterpriseName || undefined,
          state: state || undefined,
          dates: dates.every((date) => !!date) ? (dates as Array<Date>) : undefined,
          excludeds,
          fuzzy,
          page: 0,
          size: state === AllBusinessState.FACTURE ? 200 : old.size,
        }),
        state: (prev) => prev,
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      reset();
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
          amounts: undefined,
          enterpriseName: undefined,
          state: undefined,
          dates: undefined,
          excludeds: undefined,
          fuzzy: undefined,
          page: undefined,
          size: undefined,
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [reset, navigate],
  );

  useEffect(() => {
    setValue('numOrder', numOrder);
    setValue('name', name);
    setValue('contact', contact);
    setValue('deliverPhoneNumber', deliverPhoneNumber);
    setValue('zipCode', zipCode);
    setValue('installer', installer);
    setValue('enterpriseName', enterpriseName);
    setValue('state', state);
    if (!!dates) setValue('dates', dates);
    else resetField('dates');
    setValue('excludeds', excludeds);
    if (!!amounts) setValue('amounts', amounts);
    else resetField('amounts');
    setValue('fuzzy', fuzzy);
  }, [numOrder, name, contact, deliverPhoneNumber, zipCode, installer, enterpriseName, state, dates, excludeds, amounts, fuzzy]);

  useEffect(() => {
    if (representatives) setValue('representative', representatives.find((rep) => rep.id === representative)?.id);
  }, [isLoadingRepresentatives, representative]);

  return (
    <div className={styles.filters_container}>
      <div className={styles._title}>
        <h5>Filtres</h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
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
          <Controller
            control={control}
            name="amounts"
            render={({ field: { value, onChange } }) => {
              const minAmount = value[0];
              const maxAmount = value[1];

              const minPossible = 0;
              const maxPossible = 80_000;

              return (
                <ClickAwayListener onClickAway={() => setShowAmounts(false)}>
                  <div className={styles.amount_range}>
                    <button className="btn" type="button" onClick={() => setShowAmounts(!showAmounts)}>
                      <span>
                        <CurrencyFormat value={minAmount} />
                        {' - '}
                        <CurrencyFormat value={maxAmount} />
                      </span>
                      <span>{showAmounts ? <RiArrowDropUpLine size="25" /> : <RiArrowDropDownLine size="25" />}</span>
                    </button>

                    {showAmounts && (
                      <div className={styles.range_container}>
                        <div className={styles.range_inputs}>
                          <input
                            name="minAmount"
                            id="minAmount"
                            value={minAmount}
                            onChange={(e) => onChange([Number(e.target.value), maxAmount])}
                            min={0}
                            max={maxAmount}
                            step={500}
                            type="number"
                          />
                          <input
                            name="maxAmount"
                            id="maxAmount"
                            value={maxAmount}
                            onChange={(e) => onChange([minAmount, Number(e.target.value)])}
                            min={minAmount}
                            max={maxPossible}
                            step={500}
                            type="number"
                          />
                        </div>
                        <div className={styles.range_slider}>
                          <Range
                            step={100}
                            min={0}
                            max={maxPossible}
                            values={value}
                            onChange={(values) => onChange(values)}
                            renderTrack={({ props, children }) => (
                              <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                style={{
                                  ...props.style,
                                  height: '36px',
                                  display: 'flex',
                                  width: '100%',
                                }}
                              >
                                <div
                                  ref={props.ref}
                                  style={{
                                    height: '5px',
                                    width: '100%',
                                    borderRadius: '4px',
                                    background: getTrackBackground({
                                      colors: ['#ccc', '#31385A', '#ccc'],
                                      values: value,
                                      min: minPossible,
                                      max: maxPossible,
                                    }),
                                    alignSelf: 'center',
                                  }}
                                >
                                  {children}
                                </div>
                              </div>
                            )}
                            renderThumb={({ props }) => (
                              <div
                                {...props}
                                style={{
                                  ...props.style,
                                  height: '12px',
                                  width: '12px',
                                  backgroundColor: '#31385A',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className={styles.buttons_container}>
                          <button type="button" className="btn btn-primary" onClick={() => resetField('amounts')}>
                            RAZ
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => setShowAmounts(false)}>
                            Valider
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </ClickAwayListener>
              );
            }}
          />
          <input placeholder="Numéro de commande" id="businessNumOrder" {...register('numOrder')} />
          <input placeholder="Code Postal de livraison" id="zipCode" {...register('zipCode')} />
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
            <select id="representative" {...register('representative', { onChange: handleSubmit(onSubmit) })}>
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
          <select id="state" {...register('state', { setValueAs: (val) => val || undefined, onChange: handleSubmit(onSubmit) })} defaultValue="">
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
              <PhoneInput
                value={value ? (value as E164Number) : undefined}
                onChange={onChange}
                id="businessDeliverPhoneNumber"
                country="FR"
                placeholder="Numéro de téléphone du client"
              />
            )}
          />
        </div>
        <div className={styles.search_buttons}>
          <div className="flex items-center gap-3">
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
                      onChange={(e) => {
                        onChange(e.map((opt) => opt.value));
                        handleSubmit(onSubmit)();
                      }}
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
            <Controller
              control={control}
              name="fuzzy"
              render={({ field: { value, onChange } }) => (
                <div className="flex gap-1">
                  <label htmlFor="fuzzy" className="font-['DIN2014'] text-base text-[color:var(--primary-color)]">
                    Recherche floue
                  </label>
                  <input
                    type="checkbox"
                    id="fuzzy"
                    checked={value}
                    onChange={(e) => {
                      onChange(e);
                      handleSubmit(onSubmit)();
                    }}
                  />
                </div>
              )}
            />
          </div>
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
