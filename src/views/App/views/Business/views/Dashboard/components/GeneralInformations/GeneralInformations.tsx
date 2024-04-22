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
  );
}
