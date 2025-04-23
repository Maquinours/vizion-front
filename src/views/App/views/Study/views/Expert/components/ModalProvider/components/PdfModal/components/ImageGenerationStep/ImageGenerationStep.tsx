import { toBlob } from 'html-to-image';
import { useContext, useEffect, useRef } from 'react';
import { useNodesInitialized } from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import ExpertStudyContext, { ExpertStudyModalType } from '../../../../../../utils/context';
import useStore, { RFState } from '../../../../../Flow/utils/store';
import { toast } from 'react-toastify';
import LoaderModal from '../../../../../../../../../../../../components/LoaderModal/LoaderModal';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  getPages: state.getPages,
  setCurrentPage: state.setCurrentPage,
});
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentImageGenerationStepComponent() {
  const { setModal } = useContext(ExpertStudyContext)!;

  const { currentPage, getPages, setCurrentPage } = useStore(useShallow(selector));
  const nodesInitialized = useNodesInitialized();

  const data = useRef<Map<number, Blob>>(new Map());

  useEffect(() => {
    const pages = getPages();

    const next = () => {
      const next = Array.from({ length: pages.length }, (_, index) => index).find(
        (pageIndex) => !data.current.has(pageIndex) && pages[pageIndex].nodes.length > 0,
      );
      if (next !== undefined) setCurrentPage(next);
      else
        setModal({
          type: ExpertStudyModalType.PDF,
          data: {
            step: 'SHOW',
            images: Array.from(data.current.entries())
              .sort(([a], [b]) => a - b)
              .map(([, blob]) => blob),
          },
        });
    };

    if (pages[currentPage].nodes.length === 0) next();
    else if (nodesInitialized) {
      toBlob(document.querySelector('.react-flow') as HTMLElement, {
        quality: 1,
        cacheBust: true,
      })
        .then((blob) => {
          data.current.set(currentPage, blob!);
          next();
        })
        .catch((error) => {
          console.error('pdf generation error', error);
          toast.error('Une erreur est survenue lors de la génération du PDF, veuillez réessayer ultérieurement.');
          setModal(undefined);
        });
    }
  }, [currentPage, nodesInitialized]);

  return <LoaderModal />;
}
