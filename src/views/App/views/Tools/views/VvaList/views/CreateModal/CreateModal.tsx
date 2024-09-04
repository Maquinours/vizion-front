import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './CreateModal.module.scss';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import { yearsList } from '../../../../../../../../utils/functions/dates';
import MONTHS from '../../../../../../../../utils/constants/months';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClipLoader } from 'react-spinners';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { FaTrash } from 'react-icons/fa';
import { useMemo } from 'react';
import TableComponent from '../../../../../../../../components/Table/Table';
import { createMultipleSalesVva } from '../../../../../../../../utils/api/salesVva';
import SalesType from '../../../../../../../../utils/enums/SalesType';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';

type VvaLine = yup.InferType<typeof yupSchema>['lines'][0];

const routeApi = getRouteApi('/app/tools/vva/create');

const years = yearsList();

const columnHelper = createColumnHelper<VvaLine>();

const yupSchema = yup.object({
  year: yup.number().required(),
  month: yup.number().required(),
  lines: yup
    .array()
    .of(
      yup.object({
        address: yup.string().required('Le nom est requis'),
        zipCode: yup
          .string()
          .required('Le code postal est requis')
          .matches(/([A-Z0-9]{5})$/, {
            message: 'Format invalide (95012 / 2A256)',
            excludeEmptyString: true,
          }),
        amount: yup.number().typeError('Format invalide').required('Le montant est requis'),
      }),
    )
    .required(),
});

export default function AppViewToolsViewVvaListViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      lines: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });

  const lines = useWatch({
    name: 'lines',
    control,
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Livré à',
        cell: ({ row: { index } }) => (
          <div>
            <input {...register(`lines.${index}.address`)} />
            <p className={styles.__errors}>{errors.lines && errors.lines[index]?.address?.message}</p>
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Code Postal',
        cell: ({ row: { index } }) => (
          <div>
            <input {...register(`lines.${index}.zipCode`)} />
            <p className={styles.__errors}>{errors.lines && errors.lines[index]?.zipCode?.message}</p>
          </div>
        ),
      }),
      columnHelper.display({
        header: 'Montant HT',
        cell: ({ row: { index } }) => (
          <div>
            <Controller
              control={control}
              name={`lines.${index}.amount`}
              render={({ field: { value, onChange } }) => (
                <CurrencyFormat displayType="input" defaultValue={0} value={value} onValueChange={(v) => onChange(Number(v.value))} />
              )}
            />
            <p className={styles.__errors}>{errors.lines && errors.lines[index]?.amount?.message}</p>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'action',
        cell: ({ row: { index } }) => (
          <button className={styles.action} onClick={() => remove(index)}>
            <FaTrash color="#F24C52" />
          </button>
        ),
      }),
    ],
    [register, control, remove, fields, errors],
  );

  const totalAmount = lines.reduce((acc, el) => acc + el.amount, 0);

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ year, month, lines }: yup.InferType<typeof yupSchema>) => {
      const startAndEnd = (() => {
        const currentMonth = new Date(year, month);
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const data = {
          firstDay,
          lastDay,
        };
        return data;
      })();

      const departments = await queryClient.ensureQueryData(queries.departments.list);

      return createMultipleSalesVva(
        lines.map((line) => {
          const department = departments.find((dep) => [line.zipCode?.slice(0, 2), line.zipCode?.slice(0, 3)].includes(dep.code));

          return {
            address: line.address,
            enterpriseName: line.address,
            zipCode: line.zipCode,
            departmentCode: department!.code,
            representativeName: department?.repEnterprise?.name,
            representativeId: department?.repEnterprise?.id,
            amountHT: line.amount,
            type: SalesType.VVA,
            year: year,
            month: month + 1,
            startDate: `${startAndEnd.firstDay.getFullYear()}-${startAndEnd.firstDay.getMonth() + 1 < 10 ? '0' : ''}${startAndEnd.firstDay.getMonth() + 1}-${
              startAndEnd.firstDay.getDate() < 10 ? '0' : ''
            }${startAndEnd.firstDay.getDate()}`,
            endDate: `${startAndEnd.lastDay.getFullYear()}-${startAndEnd.lastDay.getMonth() + 1 < 10 ? '0' : ''}${startAndEnd.lastDay.getMonth() + 1}-${
              startAndEnd.lastDay.getDate() < 10 ? '0' : ''
            }${startAndEnd.lastDay.getDate()}`,
          };
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['sales-vva']._def });
      toast.success('Les VVA ont été importées avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'importation des VVA");
    },
  });

  return (
    <ReactModal isOpen={true} className={styles.modal} onRequestClose={onClose} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter une commission VVA</h6>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.header}>
            <div className={styles.input_container}>
              <div className={styles.form_group}>
                <label htmlFor="year">Année :</label>
                <select id="year" {...register('year')}>
                  {years.map((item, key) => (
                    <option key={key} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="month">Mois :</label>
                <select id="month" {...register('month')}>
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <CurrencyFormat className={styles.total_amount} prefix="Total: " value={totalAmount} />
            </div>
            <div className={styles.add_button}>
              <button className="btn btn-primary" onClick={() => append({ address: '', zipCode: '', amount: 0 })}>
                Ajouter une ligne
              </button>
            </div>
          </div>
          <div className={styles.step_one}>
            <div className={styles.table_container}>
              <TableComponent data={fields} isLoading={false} columns={columns} />
            </div>
            <div className={styles.loader_container}>
              <ClipLoader color="#16204E" loading={isPending} className="" size={35} speedMultiplier={0.8} />
            </div>
            <div className={styles.footer_container}>
              <button className="btn btn-primary" onClick={onClose} disabled={isPending}>
                Annuler
              </button>
              <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))} disabled={isPending}>
                Importer les VVA
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
