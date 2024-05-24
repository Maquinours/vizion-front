import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import TableComponent from '../../../../../../components/Table/Table';
import { queries } from '../../../../../../utils/constants/queryKeys';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import styles from './SearchByProductsModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/search-by-products');

enum DataType {
  EQUAL = 'EQUAL',
  SUPERIOR = 'SUPERIOR',
  INFERIOR = 'INFERIOR',
}

const types = [
  { label: 'Egal à', value: DataType.EQUAL },
  { label: 'Supérieur à', value: DataType.SUPERIOR },
  { label: 'Inférieur à', value: DataType.INFERIOR },
];

const rowsColumnHelper = createColumnHelper<{ product: ProductResponseDto; type: DataType; quantity: number }>();

const addYupSchema = yup.object().shape({
  product: yup.mixed<ProductResponseDto>().required('Champs requis'),
});

const rowsYupSchema = yup.object().shape({
  rows: yup
    .array()
    .of(
      yup.object().shape({
        product: yup.mixed<ProductResponseDto>().required('Champs requis'),
        type: yup.mixed<DataType>().oneOf(Object.values(DataType), 'Champs requis').required('Champs requis'),
        quantity: yup.number().min(0, 'Min 0').typeError('Format invalide').required('Le champs est requis'),
      }),
    )
    .min(1, 'Min 1')
    .required('Champs requis'),
});

export default function AppViewBusinessesRmaViewSearchByProductsModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    control: addControl,
    reset: addReset,
    handleSubmit: handleAddSubmit,
  } = useForm({
    resolver: yupResolver(addYupSchema),
  });

  const {
    register: rowsRegister,
    control: rowsControl,
    handleSubmit: handleRowsSubmit,
  } = useForm({
    resolver: yupResolver(rowsYupSchema),
    defaultValues: {
      rows: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: rowsControl,
    name: 'rows',
  });

  const columns = useMemo(
    () => [
      rowsColumnHelper.display({
        header: 'Référence',
        cell: ({ row: { original } }) => original.product.reference,
      }),
      rowsColumnHelper.display({
        header: 'Type',
        cell: ({ row: { index } }) => (
          <select {...rowsRegister(`rows.${index}.type`)}>
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        ),
      }),
      rowsColumnHelper.display({
        header: 'Quantité',
        cell: ({ row: { index } }) => <input {...rowsRegister(`rows.${index}.quantity`)} />,
      }),
      rowsColumnHelper.display({
        header: 'Désignation',
        cell: ({ row: { original } }) => original.product.shortDescription,
      }),
      rowsColumnHelper.display({
        header: 'Suppression',
        cell: ({ row: { index } }) => (
          <button className={styles.tooltip}>
            <IoMdClose onClick={() => remove(index)} />
          </button>
        ),
      }),
    ],
    [rowsRegister, remove],
  );

  const onAddSubmit = ({ product }: yup.InferType<typeof addYupSchema>) => {
    append({ product, type: DataType.EQUAL, quantity: 0 });
    addReset();
  };

  const onRowsSubmit = ({ rows }: yup.InferType<typeof rowsYupSchema>) => {
    navigate({
      to: '..',
      search: (old) => old,
      state: {
        qInfos: rows.map((row) => ({
          ref: row.product.reference,
          min: row.type === DataType.INFERIOR ? 1 : row.quantity,
          max: row.type === DataType.SUPERIOR ? 1000 : row.quantity,
        })),
      },
      replace: true,
    });
  };

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Rechercher une affaire par liste de produits</h6>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.modalContent_header}>
            <form onSubmit={handleAddSubmit(onAddSubmit)} onReset={() => addReset()}>
              <div className={styles.form_group}>
                <div className={styles.react_select_custom}>
                  <Controller
                    control={addControl}
                    name="product"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        value={value}
                        placeholder="Produit"
                        options={products}
                        getOptionLabel={(opt) => opt.reference ?? ''}
                        getOptionValue={(opt) => opt.id}
                        onChange={onChange}
                        isLoading={isLoadingProducts}
                      />
                    )}
                  />
                </div>
              </div>
              <div className={styles.form_buttons}>
                <button className="btn btn-secondary" type="submit">
                  Ajouter
                </button>
                <button className="btn btn-primary" type="reset">
                  RAZ
                </button>
              </div>
            </form>
          </div>
          <div className={styles.modal_table}>
            <TableComponent data={fields} isLoading={false} columns={columns} />
          </div>
          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
              Annuler
            </button>
            <button className="btn btn-secondary" onClick={handleRowsSubmit(onRowsSubmit)}>
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
