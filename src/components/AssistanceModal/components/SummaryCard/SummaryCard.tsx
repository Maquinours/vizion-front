import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import styles from './SummaryCard.module.scss';
import TechnicalSupportResponseDto from '../../../../utils/types/TechnicalSupportResponseDto';
import { technicalSupportRecapOptionsQueryKeys } from '../../../../utils/constants/queryKeys/technicalSupportRecapOptions';
import {
  createTechnicalSupportRecapOption,
  deleteTechnicalSupportRecapOption,
  updateTechnicalSupportRecapOption,
} from '../../../../utils/api/technicalSupportRecapOptions';
import CardComponent from '../../../Card/Card';
import TableComponent from '../../../Table/Table';
import TechnicalSupportRecapOptionResponseDto from '../../../../utils/types/TechnicalSupportRecapOptionResponseDto';

const columnHelper = createColumnHelper<Pick<TechnicalSupportRecapOptionResponseDto, 'name' | 'value'>>();

const yupSchema = yup.object().shape({
  items: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string().defined(),
        value: yup.string().defined(),
      }),
    )
    .required(),
});

type AppViewAssistanceViewSummaryCardComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AssistanceModalComponentSummaryCardComponent({ assistance }: AppViewAssistanceViewSummaryCardComponentProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(technicalSupportRecapOptionsQueryKeys.list._ctx.byTechnicalSupportId(assistance.id));

  const { control, register, setValue, getValues, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      items: [{ name: '', value: '' }],
    },
  });

  const items = useWatch({ control, name: 'items' });

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Nom',
        cell: ({ row: { original, index } }) => <input {...register(`items.${index}.name`)} defaultValue={original.name} className="px-1" />,
      }),
      columnHelper.display({
        header: 'Valeur',
        cell: ({ row: { original, index } }) => <input {...register(`items.${index}.value`)} defaultValue={original.value} className="px-1" />,
      }),
    ],
    [register],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ items }: yup.InferType<typeof yupSchema>) => {
      const list = [];
      for (const item of items) {
        if (item.id) {
          const dataItem = data?.find((d) => d.id === item.id);
          if (!dataItem) continue;
          if (!item.name && !item.value) list.push(deleteTechnicalSupportRecapOption(dataItem.id));
          // update
          else if (dataItem.name !== item.name || dataItem.value !== item.value)
            list.push(updateTechnicalSupportRecapOption(dataItem.id, { name: item.name, value: item.value }));
        } else if (item.name || item.value) list.push(createTechnicalSupportRecapOption({ name: item.name, value: item.value, supportId: assistance.id }));
      }
      return await Promise.all(list);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicalSupportRecapOptionsQueryKeys._def });
      toast.success('Les données ont été sauvegardées avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la sauvegarde des données');
    },
  });

  useEffect(() => {
    if (data) {
      setValue('items', [...data.map((d) => ({ name: d.name, value: d.value, id: d.id })), { name: '', value: '' }]);
    }
  }, [data]);

  useEffect(() => {
    const items = getValues('items');
    const lastItem = items.at(-1);
    if (!lastItem || !!lastItem.name || !!lastItem.value) setValue('items', [...items, { name: '', value: '' }]);
  }, [JSON.stringify(items)]);

  return (
    <CardComponent title="Récapitulatif" className={styles.card}>
      <div className={styles.container}>
        <div className={styles.buttons_container}>
          <button className="btn btn-primary" disabled={isPending} onClick={handleSubmit((data) => mutate(data))}>
            {isPending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
          </button>
          {(() => {
            const nvrSerialNumber = data?.find((d) => d.name === 'S2C')?.value;
            if (!nvrSerialNumber) return null;
            return (
              <a
                href={`https://myvizeo.fr/webproxy/home?id=${nvrSerialNumber}`}
                target="_blank"
                title="Accéder à l'enregistreur"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Accéder à l&apos;enregistreur
              </a>
            );
          })()}
        </div>
        <div className={styles.table_container}>
          <TableComponent columns={columns} data={items} isLoading={isLoading} />
        </div>
      </div>
    </CardComponent>
  );
}
