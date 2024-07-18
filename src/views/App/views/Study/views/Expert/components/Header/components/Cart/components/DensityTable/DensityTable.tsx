import { useSuspenseQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { ReactFlowState, useReactFlow, useStore } from '@xyflow/react';
import { isEqual } from 'lodash';
import { useCallback, useMemo } from 'react';
import { NumberFormatValues, SourceInfo } from 'react-number-format';
import AmountFormat from '../../../../../../../../../../../../components/AmountFormat/AmountFormat';
import TableComponent from '../../../../../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { ExpertStudyDensityCameraNode } from '../../../../../Flow/components/DensityCameraNode/DensityCameraNode';
import styles from './DensityTable.module.scss';

type RowData = {
  nodeId: string;
  name: string;
  reference: string;
  recognition: number;
  reading: number;
  identification: number;
  angle: { value: number; min: number; max: number };
  selected: boolean;
};

const columnHelper = createColumnHelper<RowData>();

const isValueAllowed = ({ floatValue }: NumberFormatValues, min: number, max: number) => !floatValue || (floatValue >= min && floatValue <= max);

const getRowClassName = (row: RowData) => (row.selected ? 'text-green-700' : undefined);

const selector = (state: ReactFlowState) => ({
  productNodes: state.nodes
    .filter((node): node is ExpertStudyDensityCameraNode => node.type === 'densityCamera')
    .map((node) => ({
      nodeId: node.id,
      name: node.data.name,
      productId: node.data.productId,
      angle: node.data.angle,
      selected: node.selected,
    })),
});

export default function AppViewStudyViewExpertViewHeaderComponentCartComponentDensityTableComponent() {
  const { productNodes } = useStore(selector, (a, b) => isEqual(a, b));
  const { updateNodeData, setNodes } = useReactFlow();

  const { data: products } = useSuspenseQuery(queries.product.list);

  const data = useMemo(() => {
    return productNodes
      .map((node) => {
        const product = products?.find((product) => product.id === node.productId);
        if (!product) return;
        const camSpecs = (() => {
          const hAngle = product.specificationProducts?.find((spec) => spec.specification?.name === 'ANGLE H');
          const recognition = product.specificationProducts?.find((spec) => spec.specification?.name === 'RECONNAISSANCE');
          const reading = product.specificationProducts?.find((spec) => spec.specification?.name === 'LECTURE DE PLAQUE');
          const identification = product.specificationProducts?.find((spec) => spec.specification?.name === 'IDENTIFICATION');
          return {
            hAngle: { value: hAngle?.value ?? 0, min: hAngle?.minValue ?? 0, max: hAngle?.maxValue ?? 0 },
            recognition: { value: recognition?.value ?? 0, min: recognition?.minValue ?? 0, max: recognition?.maxValue ?? 0 },
            reading: { value: reading?.value ?? 0, min: reading?.minValue ?? 0, max: reading?.maxValue ?? 0 },
            identification: { value: identification?.value ?? 0, min: identification?.minValue ?? 0, max: identification?.maxValue ?? 0 },
          };
        })();
        const computedData = (['recognition', 'reading', 'identification'] as Array<'recognition' | 'reading' | 'identification'>).reduce(
          (acc, type) => {
            if (camSpecs.hAngle.value) acc[type] = camSpecs[type].value;
            else {
              const m = (camSpecs[type].max - camSpecs[type].min) / (camSpecs.hAngle.min - camSpecs.hAngle.max);
              const b = camSpecs[type].max - m * camSpecs.hAngle.min;
              acc[type] = m * node.angle + b;
            }
            return acc;
          },
          { recognition: NaN, reading: NaN, identification: NaN },
        );
        return {
          nodeId: node.nodeId,
          name: node.name,
          reference: product.reference,
          ...computedData,
          angle: { value: node.angle, min: camSpecs.hAngle.min, max: camSpecs.hAngle.max },
          selected: node.selected ?? false,
        };
      })
      .filter((item): item is RowData => !!item);
  }, [productNodes, products]);

  const onNodeNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, nodeId: string) => {
      updateNodeData(nodeId, { name: e.target.value });
    },
    [updateNodeData],
  );

  const onNodeAngleChange = useCallback(
    (v: NumberFormatValues, source: SourceInfo, nodeId: string) => {
      if (source.source === 'prop') return;
      updateNodeData(nodeId, { angle: Number(v.value) });
    },
    [updateNodeData],
  );

  const onNodeSelectClick = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId && !node.selected ? { ...node, selected: true } : node.selected ? { ...node, selected: false } : node)),
      );
    },
    [setNodes],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Nom',
        cell: ({ row: { original } }) => (
          <input type="text" value={original.name} onChange={(e) => onNodeNameChange(e, original.nodeId)} className="flex w-full bg-inherit p-2 text-center" />
        ),
      }),
      columnHelper.display({
        header: 'Référence',
        cell: ({ row: { original } }) => <span className="flex w-full justify-center p-2">{original.reference}</span>,
      }),
      columnHelper.display({
        header: 'Identification',
        cell: ({ row: { original } }) => (
          <AmountFormat value={original.identification} decimalScale={1} displayType="text" suffix="m" className="flex w-full justify-center p-2" />
        ),
      }),
      columnHelper.display({
        header: 'Plaque',
        cell: ({ row: { original } }) => (
          <AmountFormat value={original.reading} decimalScale={1} displayType="text" suffix="m" className="flex w-full justify-center p-2" />
        ),
      }),
      columnHelper.display({
        header: 'Reconnaissance',
        cell: ({ row: { original } }) => (
          <AmountFormat value={original.recognition} decimalScale={1} displayType="text" suffix="m" className="flex w-full justify-center p-2" />
        ),
      }),
      columnHelper.display({
        header: 'Angle',
        cell: ({ row: { original } }) => (
          <AmountFormat
            value={original.angle.value}
            decimalScale={1}
            displayType="input"
            isAllowed={(v) => isValueAllowed(v, original.angle.min, original.angle.max)}
            onValueChange={(v, source) => onNodeAngleChange(v, source, original.nodeId)}
            suffix="°"
            className="flex w-full bg-inherit p-2 text-center"
          />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => (
          <div onClick={() => onNodeSelectClick(original.nodeId)} className="flex w-full justify-center">
            <button type="button" disabled={original.selected} className="btn btn-primary">
              Sélectionner
            </button>
          </div>
        ),
      }),
    ],
    [onNodeNameChange, isValueAllowed, onNodeAngleChange],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent
        columns={columns}
        data={data}
        isLoading={false}
        className="w-full divide-y divide-gray-300 text-sm text-black"
        getRowClassName={getRowClassName}
      />
    </div>
  );
}
