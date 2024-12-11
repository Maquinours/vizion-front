import { Checkbox } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Row, RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import { useReactFlow } from '@xyflow/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import { PUBLIC_BASE_URL } from '../../../../../../../../../../utils/constants/api';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import FileType from '../../../../../../../../../../utils/enums/FileType';
import { filterRecursively } from '../../../../../../../../../../utils/functions/arrays';
import { pdfUriToBase64Image } from '../../../../../../../../../../utils/functions/files';
import ExpertStudyContext from '../../../../utils/context';
import { ExpertStudyBackgroundNode } from '../../../Flow/components/BackgroundNode/BackgroundNode';
import { ExpertStudyImageNode } from '../../../Flow/components/ImageNode/ImageNode';

type LoadedImage = { key: string; name: string; src: string; loading: false };
type LoadingImage = { key: string; name: string; loading: true };
type Image = LoadedImage | LoadingImage;

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/study/expert');

const columnHelper = createColumnHelper<Image>();
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
        {row.original.loading ? (
          <ClipLoader color="#31385A" loading className="" size={48} speedMultiplier={1} />
        ) : (
          <img src={row.original.src} alt={`Aperçu de ${row.original.name}`} width={48} height={48} />
        )}
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

const enableRowSelection = (row: Row<Image>) => !row.original.loading;

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
    select: (data) =>
      filterRecursively(data, 'subRows', (item) => item.dir === false && ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'].includes(item.type)),
  });

  const [images, setImages] = useState<Array<Image>>([]);

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
        for (const image of Object.entries(rowSelection)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => images.find((image) => image.key === key))
          .filter((image): image is LoadedImage => !!image && !image.loading)) {
          const node: ExpertStudyImageNode = {
            id: uuidv4(),
            type: 'image',
            position: position,
            data: {
              image: image.src,
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
        const selection = Object.entries(rowSelection).find(([, isSelected]) => isSelected);
        if (selection) {
          const [key] = selection;
          const item = images.find((image): image is LoadedImage => image.key === key && !image.loading);
          if (item) {
            const reactFlowRect = document.querySelector('.react-flow')!.getBoundingClientRect();
            const position = screenToFlowPosition({ x: reactFlowRect.x, y: reactFlowRect.y });
            const endPosition = screenToFlowPosition({ x: reactFlowRect.x + reactFlowRect.width, y: reactFlowRect.y + reactFlowRect.height });
            const { width, height } = { width: endPosition.x - position.x, height: endPosition.y - position.y };
            const node: ExpertStudyBackgroundNode = {
              id: `background-${uuidv4()}`,
              type: 'background',
              position: position,
              data: {
                image: item.src,
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

  useEffect(() => {
    if (!data) return;
    const items: Array<Image> = [];
    for (const item of data) {
      switch (item.type) {
        case 'application/pdf':
          items.push({
            key: item.key,
            name: item.name,
            loading: true,
          });
          pdfUriToBase64Image(`${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${encodeURIComponent(item.key)}`).then((src) => {
            setImages((images) => images.map((image) => (image.key === item.key ? { ...image, src: src, loading: false } : image)));
            items.push({
              key: item.key,
              name: item.name,
              src: src,
              loading: false,
            });
          });
          break;
        default:
          items.push({
            key: item.key,
            name: item.name,
            src: `${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${encodeURIComponent(item.key)}`,
            loading: false,
          });
      }
    }
    setImages((images) => items.map((item) => images.find((image) => image.key === item.key) ?? item));
  }, [data]);

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
            data={images}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            rowId="key"
            enableMultiRowSelection={enableMultiRowSelection}
            enableRowSelection={enableRowSelection}
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
