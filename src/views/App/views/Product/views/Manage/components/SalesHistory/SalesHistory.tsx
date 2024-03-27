import { Controller, useForm } from 'react-hook-form';
import CardComponent from '../../../../../../../../components/Card/Card';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale/fr';
import { MdSearch } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { productSaleQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productSale';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import BpProductInfoHistoryResponseDto from '../../../../../../../../utils/types/BpProductInfoHistoryResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import styles from './SalesHistory.module.scss';
import TableComponent from '../../../../../../../../components/Table/Table';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import { getProductSalesByProductId, getProductSalesByProductIdAndSearch } from '../../../../../../../../utils/api/productSale';

registerLocale('fr', fr);

const routeApi = getRouteApi('/app/products/$productId/manage');

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
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();
  const { salesPage: page, salesSize: size, salesContact: contact, salesDates: dates } = routeApi.useSearch();

  const { register, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: productSaleQueryKeys.detailByProductIdAndSearch(productId, contact, dates?.at(0), dates?.at(1), page, size),
    queryFn: () =>
      !!contact || !!dates
        ? getProductSalesByProductIdAndSearch(productId, contact, dates?.at(0), dates?.at(1), page, size)
        : getProductSalesByProductId(productId, page, size),
  });

  const onSearch = ({ dates, enterpriseName }: yup.InferType<typeof yupSchema>) => {
    console.log(dates);
    navigate({ from: routeApi.id, search: (old) => ({ ...old, salesPage: 0, salesContact: enterpriseName, salesDates: dates }) });
  };

  const onReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate({ from: routeApi.id, search: (old) => ({ ...old, salesPage: 0, salesContact: undefined, salesDates: undefined }) });
  };

  const onSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ from: routeApi.id, search: (old) => ({ ...old, salesPage: 0, salesSize: Number(e.target.value) as 100 | 5 | 20 | 50 | 250 | 500 | 1000 }) });
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
            <select value={size} onChange={onSizeChange}>
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
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, salesPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </div>
    </CardComponent>
  );
}
