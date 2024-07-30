import { toBlob } from 'html-to-image';
import { useContext, useEffect, useRef } from 'react';
import { useNodesInitialized } from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../../../utils/context';
import useStore, { RFState } from '../../../../../Flow/utils/store';
import { toast } from 'react-toastify';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  pagesLength: state.pages.length,
  setCurrentPage: state.setCurrentPage,
});
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const { currentPage, pagesLength, setCurrentPage } = useStore(useShallow(selector));
  const nodesInitialized = useNodesInitialized();

  const data = useRef<Map<number, Blob>>(new Map());

  useEffect(() => {
    if (nodesInitialized) {
      toBlob(document.querySelector('.react-flow') as HTMLElement, {
        quality: 1,
      })
        .then((blob) => {
          data.current.set(currentPage, blob!);
          const next = Array.from({ length: pagesLength }, (_, index) => index).find((pageIndex) => !data.current.has(pageIndex));
          if (next !== undefined) setCurrentPage(next);
          else
            setModal({
              type: ExpertStudyModalType.PDF,
              data: {
                step: 'SHOW',
                images: Array.from(data.current.entries())
                  .sort(([a], [b]) => a - b)
                  .map(([_, blob]) => blob),
              },
            });
        })
        .catch((error) => {
          console.error('pdf generation error', error);
          toast.update('pdf-generation', {
            type: 'error',
            autoClose: 3000,
            closeButton: true,
            render: 'Une erreur est survenue lors de la génération du PDF, veuillez réessayer ultérieurement.',
            isLoading: false,
            toastId: 'pdf-generation-error',
          });
          setModal(undefined);
        });
    }
  }, [nodesInitialized]);

  return null;
}
