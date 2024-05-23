import { Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import GedComponent from '../../../../../../components/Ged/Ged';
import styles from './GedModal.module.scss';
import FileType from '../../../../../../utils/enums/FileType';

const routeApi = getRouteApi('/app/faq/ged/$faqId');

export default function AppViewFaqViewGedModalView() {
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();

  return (
    <>
      <ReactModal
        isOpen={true}
        onRequestClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
        className={styles.modal}
        overlayClassName="Overlay"
      >
        <GedComponent
          type={FileType.FAQ}
          id={faqId}
          getCreateDirectoryLink={(item) => ({
            to: '/app/faq/ged/$faqId/create-directory',
            search: (old) => ({ ...old, relativePath: item?.relativePath }),
            params: (old) => old,
            replace: true,
          })}
          getImportFilesLink={(item) => ({
            to: '/app/faq/ged/$faqId/import-files',
            search: (old) => ({ ...old, relativePath: item?.relativePath }),
            params: (old) => old,
            replace: true,
          })}
          getRenameLink={(item) => ({
            to: '/app/faq/ged/$faqId/rename/$itemRelativePath',
            search: (old) => old,
            params: (old) => ({ ...old, itemRelativePath: item.relativePath }),
            replace: true,
          })}
          getDeleteLink={(item) => ({
            to: '/app/faq/ged/$faqId/delete/$itemRelativePath',
            search: (old) => old,
            params: (old) => ({ ...old, itemRelativePath: item.relativePath }),
            replace: true,
          })}
        />
      </ReactModal>
      <Outlet />
    </>
  );
}
