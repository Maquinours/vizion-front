import { Checkbox } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import { useReactFlow } from '@xyflow/react';
import { useContext, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import { PUBLIC_BASE_URL } from '../../../../../../../../../../utils/constants/api';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import FileType from '../../../../../../../../../../utils/enums/FileType';
import { filterRecursively } from '../../../../../../../../../../utils/functions/arrays';
import FileDataTreeResponseDto from '../../../../../../../../../../utils/types/FileDataTreeResponseDto';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';
import { ExpertStudyBackgroundNode } from '../../../Flow/components/BackgroundNode/BackgroundNode';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/study/expert');

const columnHelper = createColumnHelper<FileDataTreeResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Sélection',
    cell: ({ row }) => (
      <div className="flex justify-center p-2">
        <Checkbox checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Aperçu',
    cell: ({ row }) => (
      <div className="flex justify-center p-2">
        <img src={`${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${row.original.key}`} alt={`Aperçu de ${row.original.name}`} width={48} height={48} />
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Nom',
    cell: ({ row }) => (
      <div className="flex justify-center p-2">
        <p>{row.original.name}</p>
      </div>
    ),
  }),
];

// TODO: handle PDF

type AppViewStudyViewExpertViewModalProviderComponentImportGedImageModalComponentProps = Readonly<{
  type: 'image' | 'background';
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentImportGedImageModalComponent({
  type,
}: AppViewStudyViewExpertViewModalProviderComponentImportGedImageModalComponentProps) {
  const { setModal } = useContext(ExpertStudyContext)!;
  const { addNodes, screenToFlowPosition, getNodes, deleteElements } = useReactFlow();

  const { businessId } = routeApi.useParams();

  const { data, isLoading } = useQuery({
    ...queries.geds.detail._ctx.byTypeAndId(FileType.AFFAIRE, businessId),
    select: (data) => filterRecursively(data, 'subRows', (item) => item.dir === false && ['image/png', 'image/jpeg', 'image/webp'].includes(item.type)),
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const enableMultiRowSelection = useMemo(() => type !== 'background', [type]);

  const onClose = () => {
    setModal(undefined);
  };

  const onValidate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
    const position = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });
    switch (type) {
      case 'image': {
        for (const [key] of Object.entries(rowSelection).filter(([, isSelected]) => isSelected)) {
          const node: ExpertStudyImageNode = {
            id: uuidv4(),
            type: 'image',
            position: position,
            data: {
              image: `${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${key}`,
              size: {
                width: 100,
                height: 100,
              },
              rotation: 0,
            },
          };
          addNodes(node);
        }
        break;
      }
      case 'background': {
        const item = Object.entries(rowSelection).find(([, isSelected]) => isSelected);
        if (!!item) {
          const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
          const position = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });
          const endPosition = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width, y: reactFlowRect.y + reactFlowRect.height });
          const { width, height } = { width: endPosition.x - position.x, height: endPosition.y - position.y };
          const node: ExpertStudyBackgroundNode = {
            id: 'background',
            type: 'background',
            position: position,
            data: {
              image: `${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${item[0]}`,
              width: width,
              height: height,
              scale: 1,
              opacity: 1,
              rotation: 0,
            },
            zIndex: -1,
            draggable: false,
          };
          const backgroundNodes = getNodes().filter((node) => node.type === 'background');
          deleteElements({ nodes: backgroundNodes });
          addNodes(node);
        }
      }
    }
    onClose();
  };

  const title = (() => {
    switch (type) {
      case 'image':
        return "Import d'objet(s) depuis la GED";
      case 'background':
        return "Import d'un plan depuis la GED";
    }
  })();

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className="absolute left-2/4 top-2/4 z-[2005] m-auto h-auto w-auto min-w-[70%] max-w-[1000px] -translate-x-2/4 -translate-y-2/4 rounded-[5px] p-0 opacity-100"
      overlayClassName="Overlay"
    >
      <form onSubmit={onValidate} className="w-full rounded-md bg-white pb-2">
        <h2 className="flex h-10 items-center justify-center rounded-t-md bg-[var(--primary-color)] text-white">{title}</h2>
        <div className="w-full bg-white">
          <TableComponent
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowId="key"
            enableMultiRowSelection={enableMultiRowSelection}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-x-1 pb-2 pt-4">
            <div className="text-right">
              <button type="button" className="btn btn-secondary w-fit" onClick={onClose}>
                Annuler
              </button>
            </div>
            <div className="text-left">
              <button type="submit" className="btn btn-primary w-fit">
                Appliquer
              </button>
            </div>
          </div>
        </div>
      </form>
    </ReactModal>
  );
}
