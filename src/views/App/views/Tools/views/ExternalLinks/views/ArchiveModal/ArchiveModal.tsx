import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { externalLinks } from '../../../../../../../../utils/constants/queryKeys/externalLink';
import { updateExternalLink } from '../../../../../../../../utils/api/externalLink';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import React from 'react';
import styles from './ArchiveModal.module.scss';

const routeApi = getRouteApi('/app/tools/external-links/archive/$externalLinkId');

export default function AppViewToolsViewExternalLinksViewArchiveModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { externalLinkId } = routeApi.useParams();

  const { data: externalLink } = useSuspenseQuery(externalLinks.detail._ctx.byId(externalLinkId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateExternalLink(externalLink.id, {
        title: externalLink.title,
        description: externalLink.description,
        accessLevel: externalLink.accessLevel,
        url: externalLink.url,
        fileUrl: null,
        archived: !externalLink.archived,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalLinks._def });
      toast.success('Le lien externe a été archivé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'archivage du lien externe");
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>
            Êtes-vous certain.e de vouloir{' '}
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{externalLink.archived ? 'désarchiver' : 'archiver'}</span> ce lien externe ?
          </h6>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.modal_content}>
            {externalLink.archived && <p>Le lien externe sera à nouveau visible.</p>}
            {!externalLink.archived && <p>Cette action va archiver le lien externe.</p>}
          </div>

          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.modal_buttons}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              {externalLink.archived ? 'Désarchiver' : 'Archiver'}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
