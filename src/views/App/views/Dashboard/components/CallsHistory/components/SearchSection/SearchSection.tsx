import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import styles from './SearchSection.module.scss';

const routeApi = getRouteApi('/app/dashboard');

const yupSchema = yup.object().shape({
  dates: yup.array().of(yup.date().optional().nullable()).length(2).required(),
  profile: yup.mixed<ProfileResponseDto>().nullable(),
});

export default function AppViewDashboardViewCallsHistoryComponentSearchSectionComponent() {
  const navigate = routeApi.useNavigate();

  const { callsHistoryDates, callsHistoryProfileId } = routeApi.useSearch();

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    ...queries.profiles.list,
    select: (data) => data.filter((profile) => profile.standardPhoneNumber && isValidPhoneNumber(profile.standardPhoneNumber, 'FR')),
  });

  const { control, resetField, reset, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      dates: [undefined, undefined],
      profile: null,
    },
  });

  useEffect(() => {
    resetField('dates', { defaultValue: callsHistoryDates ?? [undefined, undefined] });
  }, [callsHistoryDates]);

  useEffect(() => {
    resetField('profile', { defaultValue: profiles?.find((profile) => profile.id === callsHistoryProfileId) ?? null });
  }, [callsHistoryProfileId, profiles]);

  const onChangeDates = useCallback((dates: [Date | null, Date | null]) => {
    console.log(dates);
    // if (dates.every((date) => !!date) || dates.every((date) => !date)) handleSubmit(onSubmit)();
  }, []);

  const onSubmit = useCallback(({ dates, profile }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: {
        callsHistoryDates: dates.every((date) => !!date) ? [moment(dates.at(0)).startOf('day').toDate(), moment(dates.at(1)).endOf('day').toDate()] : undefined,
        callsHistoryProfileId: profile?.id,
      },
    });
  }, []);

  const onReset = useCallback(() => {
    reset({ dates: [undefined, undefined], profile: null });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={onReset} className={styles.container}>
      <div className={styles.inputs_container}>
        <Controller
          control={control}
          name="dates"
          render={({ field: { value, onChange } }) => (
            <ReactDatePicker
              selectsRange
              onChange={(v) => {
                onChange(v);
                onChangeDates(v);
              }}
              startDate={value ? value[0] : undefined}
              endDate={value ? value[1] : undefined}
              allowSameDay
              withPortal
              locale="fr"
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              scrollableMonthYearDropdown
              placeholderText="Date"
              isClearable
              className={styles.datepicker}
            />
          )}
        />
        <Controller
          control={control}
          name="profile"
          render={({ field: { value, onChange } }) => (
            <CustomSelect
              options={profiles}
              isLoading={isLoadingProfiles}
              getOptionLabel={(opt) => `${opt.enterprise?.name ?? ''} / ${opt.firstName ?? ''} ${opt.lastName ?? ''}`.trim()}
              getOptionValue={(opt) => opt.id}
              value={value}
              onChange={(v) => {
                onChange(v);
                handleSubmit(onSubmit)();
              }}
              placeholder="Contact"
              isClearable
            />
          )}
        />
      </div>
      <div className={styles.buttons_container}>
        <button type="reset" className="btn btn-primary-light">
          RAZ
        </button>
        <button type="submit" className="btn btn-primary">
          Rechercher
        </button>
      </div>
    </form>
  );
}
