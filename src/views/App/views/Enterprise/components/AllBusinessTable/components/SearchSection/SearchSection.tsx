import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { SingleValue } from 'react-select';
import { useEffect } from 'react';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

const yupSchema = yup.object().shape({
  contact: yup.mixed<ProfileResponseDto>().nullable(),
});

export default function AppViewEnterpriseViewAllBusinessTableComponentSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { allBusinessProfileId } = routeApi.useSearch();

  const { data } = useQuery(queries.profiles.list._ctx.byEnterpriseId(enterpriseId));

  const { control, reset } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      contact: null,
    },
  });

  const onChange = (val: SingleValue<ProfileResponseDto>) => {
    navigate({ search: (old) => ({ ...old, allBusinessPage: undefined, allBusinessProfileId: val?.id ?? undefined, replace: true, resetScroll: false }) });
  };

  useEffect(() => {
    reset({
      contact: data?.find((item) => item.id === allBusinessProfileId) ?? null,
    });
  }, [allBusinessProfileId, data]);

  return (
    <div>
      <Controller
        control={control}
        name="contact"
        render={({ field }) => (
          <CustomSelect
            options={data}
            value={field.value}
            onChange={(val, meta) => {
              field.onChange(val, meta);
              onChange(val);
            }}
            getOptionLabel={(opt) => `${opt.firstName ?? ''} ${opt.lastName ?? ''}`.trim()}
            getOptionValue={(opt) => opt.id}
            placeholder="Filtrer par contact"
            isClearable
          />
        )}
      />
    </div>
  );
}
