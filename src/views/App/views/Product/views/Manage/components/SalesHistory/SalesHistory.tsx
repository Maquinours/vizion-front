import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { fr } from 'date-fns/locale/fr';
import React, { useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from 'react-hook-form';
import { MdSearch } from 'react-icons/md';
import * as yup from 'yup';
import CardComponent from '../../../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import BpProductInfoHistoryResponseDto from '../../../../../../../../utils/types/BpProductInfoHistoryResponseDto';
import styles from './SalesHistory.module.scss';

registerLocale('fr', fr);

const routeApi = getRouteApi('/app/products_/$productId/manage');
const routePath = '/app/products/$productId/manage';

const sizeOptions = [5, 20, 50, 100, 250, 500, 1000];

const columnHelper = createColumnHelper<BpProductInfoHistoryResponseDto>();
const columns = [
  columnHelper.display({ header: 'Date', cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.createdDate) }),
  columnHelper.display({ header: 'Affaire', cell: ({ row: { original } }) => original.businessNumber }),
  columnHelper.display({ header: 'Entreprise', cell: ({ row: { original } }) => original.enterpriseName }),
  columnHelper.display({ header: 'Qté dans le BP', cell: ({ row: { original } }) => original.qtyPrepared }),
];

const yupSchema = yup.object({
  dates: yup.array().of(yup.date().required()).min(2).max(2),
  enterpriseName: yup.string(),
});

export default function AppViewProductViewManageViewSalesHistoryComponent() {
  const navigate = routeApi.useNavigate();

  const { productId } = routeApi.useParams();
  const { salesPage: page, salesSize: size, salesContact: contact, salesDates: dates } = routeApi.useSearch();

  const { register, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  const { data, isLoading } = useQuery(
    queries['product-sale'].detail._ctx.byProductRefAndSearch({
      productRef: product.reference!,
      contact,
      startDate: dates?.at(0),
      endDate: dates?.at(1),
      page,
      size,
    }),
  );

  const onSearch = ({ dates, enterpriseName }: yup.InferType<typeof yupSchema>) => {
    navigate({
      search: (old) => ({ ...old, salesPage: 0, salesContact: enterpriseName, salesDates: dates }),
      replace: true,
      resetScroll: false,
    });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({
      search: (old) => ({ ...old, salesPage: 0, salesContact: undefined, salesDates: undefined }),
      replace: true,
      resetScroll: false,
    });
  };

  const onSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({
      search: (old) => ({ ...old, salesPage: 0, salesSize: Number(e.target.value) as 100 | 5 | 20 | 50 | 250 | 500 | 1000 }),
      replace: true,
      resetScroll: false,
    });
  };

  useEffect(() => {
    setValue('enterpriseName', contact);
    setValue('dates', dates);
  }, [contact, dates]);

  return (
    <CardComponent title="Historique des ventes">
      <div className={styles.container}>
        <div className={styles.header}>
          <form className={styles.search_container} onSubmit={handleSubmit(onSearch)} onReset={onReset}>
            <input {...register('enterpriseName')} placeholder="Entreprise" />

            <Controller
              control={control}
              name={'dates'}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selectsRange={true}
                  onChange={(dates) => onChange(dates.every((date) => date === null) ? undefined : dates)}
                  startDate={value?.at(0)}
                  endDate={value?.at(1)}
                  allowSameDay
                  withPortal
                  closeOnScroll={true}
                  locale="fr"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Plage de date"
                  isClearable={true}
                />
              )}
            />
            <button type="submit" className="btn btn-primary">
              <MdSearch />
            </button>
            <button type="reset" className="btn btn-primary">
              RAZ
            </button>
          </form>
          <div className={styles.actions_container}>
            <select value={size} onChange={onSizeChange} className={styles.size_select}>
              {sizeOptions.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.total_container}>
          <div className={styles._content}>
            <div>Total vendu : </div>
            <div>
              <span>{data?.qtyInfo?.quantitySold ?? 0}</span>
            </div>
            <div>Total reçu : </div>
            <div>
              <span>{data?.qtyInfo?.quantityReceived ?? 0}</span>
            </div>
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.container}>
            <TableComponent isLoading={isLoading} columns={columns} data={data?.data?.content} />
          </div>
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.data?.totalPages ?? 0}
              pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, salesPage: page }), replace: true, resetScroll: false })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
