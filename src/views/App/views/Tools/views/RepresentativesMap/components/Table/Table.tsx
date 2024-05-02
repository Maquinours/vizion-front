import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import DepartmentResponseDto from '../../../../../../../../utils/types/DepartmentResponseDto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import TableComponent from '../../../../../../../../components/Table/Table';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import { updateDepartment } from '../../../../../../../../utils/api/department';
import { toast } from 'react-toastify';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<DepartmentResponseDto>();

export default function AppViewToolsViewRepresentativesMapViewTableComponent() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(queries.departments.list);
  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const { mutate } = useMutation({
    mutationFn: ({ department, representative }: { department: DepartmentResponseDto; representative: EnterpriseResponseDto | null }) =>
      updateDepartment(department.id, {
        name: department.name,
        code: department.code,
        repEnterpriseId: representative?.id,
      }),
    onMutate: (params) => {
      queryClient.setQueryData<Array<DepartmentResponseDto>>(queries.departments.list.queryKey, (old) =>
        old?.map((dep) => (dep.id === params.department.id ? { ...dep, repEnterprise: params.representative } : dep)),
      );
      return { department: params.department };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.departments._def });
    },
    onError: (error, _params, context) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour du département');
      queryClient.setQueryData<Array<DepartmentResponseDto>>(queries.departments.list.queryKey, (old) =>
        old?.map((dep) => (dep.id === context?.department.id ? context.department : dep)),
      );
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Numéro',
        cell: ({ row: { original } }) => <div>{original.code}</div>,
      }),
      columnHelper.display({
        header: 'Département',
        cell: ({ row: { original } }) => <div>{original.name}</div>,
      }),
      columnHelper.display({
        header: 'Représentant',
        cell: ({ row: { original } }) => (
          <div className={styles.action_buttons}>
            <CustomSelect
              options={representatives}
              isLoading={isLoadingRepresentatives}
              value={representatives?.find((rep) => rep.id === original.repEnterprise?.id)}
              onChange={(rep) => mutate({ department: original, representative: rep })}
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.id}
              isMulti={false}
              isClearable={true}
              placeholder="Sélectionner un représentant"
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  background: 'transparent',
                }),
              }}
            />
          </div>
        ),
      }),
    ],
    [representatives],
  );

  return (
    <div className={styles.table_item}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
