import { Controller, useForm } from 'react-hook-form';
import styles from './ImportOtherBusinessQuotation.module.scss';
import * as yup from 'yup';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../../../utils/enums/BusinessState';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { yupResolver } from '@hookform/resolvers/yup';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

const yupSchema = yup.object().shape({
  fromBusiness: yup.mixed<BusinessResponseDto>().required(),
});

export default function AppViewBusinessViewDashboardViewImportOtherBusinessQuotationComponent() {
  const navigate = useNavigate({ from: routeApi.id });
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data: availableBusinesses, isLoading: isLoadingAvailableBusinesses } = useQuery({
    ...queries.businesses.list._ctx.all,
    select: (data) =>
      data.filter(
        (b) =>
          b.state !== null &&
          [BusinessState.DEVIS, BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE].includes(b.state) &&
          b.id !== business.id,
      ),
  });

  const { control, reset, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onSubmit = ({ fromBusiness }: yup.InferType<typeof yupSchema>) => {
    navigate({
      to: 'confirm-quotation-import/$otherBusinessId',
      params: { otherBusinessId: fromBusiness.id },
      search: (old) => old,
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <div className={styles.form}>
      <div className={styles.react_select}>
        <p>Reprendre une affaire</p>
        <Controller
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              menuPlacement="auto"
              value={value}
              placeholder="Sélectionnez une affaire"
              options={availableBusinesses}
              isLoading={isLoadingAvailableBusinesses}
              getOptionLabel={(option) => `${option.numBusiness}${option.title ? `/ ${option.title}` : ''}`}
              getOptionValue={(option) => option.id}
              onChange={onChange}
            />
          )}
          name="fromBusiness"
          control={control}
        />
      </div>
      <div className={styles.form_buttons}>
        <button className="btn btn-primary" onClick={() => reset()}>
          RAZ
        </button>
        <button
          className="btn btn-secondary"
          disabled={
            !business.state || [BusinessState.ARC, BusinessState.BP, BusinessState.BL, BusinessState.FACTURE, BusinessState.ARCHIVE].includes(business.state)
          }
          onClick={handleSubmit(onSubmit)}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
