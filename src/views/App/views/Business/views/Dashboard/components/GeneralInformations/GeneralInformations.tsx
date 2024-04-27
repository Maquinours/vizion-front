import { getRouteApi } from '@tanstack/react-router';
import styles from './GeneralInformations.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useMemo } from 'react';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { BusinessDashboardFormType } from '../../Dashboard';
import { MdSave } from 'react-icons/md';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

const deliveryOptions = [
  {
    value: '',
    text: 'Choisir',
  },
  {
    value: 'A expédier',
    text: 'A expédier',
  },
  {
    value: 'A disposition',
    text: 'A disposition',
  },
  {
    value: 'A grouper',
    text: 'A grouper',
  },
  {
    value: 'Virtuel',
    text: 'Virtuel',
  },
];

type AppViewBusinessViewDashboardViewGeneralInformationsComponentProps = Readonly<{
  register: UseFormRegister<BusinessDashboardFormType>;
  errors: FieldErrors<BusinessDashboardFormType>;
  onSave: () => void;
  isSavePending: boolean;
}>;
export default function AppViewBusinessViewDashboardViewGeneralInformationsComponent({
  register,
  errors,
  onSave,
  isSavePending,
}: AppViewBusinessViewDashboardViewGeneralInformationsComponentProps) {
  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const isUpdatable = useMemo(
    () =>
      (![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state!) ||
        user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) &&
      !business.archived,
    [user, business],
  );

  return (
    <div className={styles.general_informations}>
      <div className={styles.business_info_sections}>
        <div className={styles.form_group}>
          <label htmlFor="businessName">Nom de l&apos; affaire</label>
          <div className={styles.form_input_save}>
            <input {...register('businessName')} id="businessName" placeholder="..." disabled={!isUpdatable} />
            {isUpdatable && (
              <button disabled={isSavePending} onClick={onSave}>
                <MdSave />
              </button>
            )}
          </div>
          <p className={styles.__errors}>{errors.businessName?.message}</p>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="businessInstaller">Installateur</label>
          <div className={styles.form_input_save}>
            <input id="businessInstaller" {...register('businessInstaller')} placeholder="..." disabled={!isUpdatable} />
            {isUpdatable && (
              <button disabled={isSavePending} onClick={onSave}>
                <MdSave />
              </button>
            )}
          </div>
          <p className={styles.__errors}>{errors.businessInstaller?.message}</p>
        </div>
      </div>
      <div className={styles.delivery_section}>
        <div className={styles.form_group}>
          <label htmlFor="businessDeliveryMode">Mode de livraison</label>
          <div className={styles.form_select_save}>
            <select id="businessDeliveryMode" {...register('businessDeliveryMode')}>
              {deliveryOptions.map((itm) => (
                <option key={itm.value} value={itm.value}>
                  {itm.text}
                </option>
              ))}
            </select>
            {(![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state!) ||
              (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && business.state === 'FACTURE')) &&
              !business.archived && (
                <button disabled={isSavePending} onClick={onSave}>
                  <MdSave />
                </button>
              )}
          </div>
          <p className={styles.__errors}>{errors.businessDeliveryMode?.message}</p>
        </div>
      </div>
    </div>
  );
}
