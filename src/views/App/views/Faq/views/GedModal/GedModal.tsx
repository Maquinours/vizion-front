import { Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import GedComponent from '../../../../../../components/Ged/Ged';
import FileType from '../../../../../../utils/enums/FileType';
import styles from './GedModal.module.scss';

const routeApi = getRouteApi('/app/faq/ged/$faqId');

export default function AppViewFaqViewGedModalView() {
  const navigate = routeApi.useNavigate();

  const { faqId } = routeApi.useParams();

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={() => navigate({ to: '../..', search: (old) => old })} className={styles.modal} overlayClassName="Overlay">
        <GedComponent
          type={FileType.FAQ}
          id={faqId}
          getCreateDirectoryLink={(item) => ({
            to: '/app/faq/ged/$faqId/create-directory',
            search: (old) => ({ ...old, relativePath: item?.relativePath }),
            params: (old) => old,
            replace: true,
            resetScroll: false,
          })}
          getImportFilesLink={(item) => ({
            to: '/app/faq/ged/$faqId/import-files',
            search: (old) => ({ ...old, relativePath: item?.relativePath }),
            params: (old) => old,
            replace: true,
            resetScroll: false,
          })}
          getRenameLink={(item) => ({
            to: '/app/faq/ged/$faqId/rename/$itemRelativePath',
            search: (old) => old,
            params: (old) => ({ ...old, itemRelativePath: item.relativePath }),
            replace: true,
            resetScroll: false,
          })}
          getDeleteLink={(item) => ({
            to: '/app/faq/ged/$faqId/delete/$itemRelativePath',
            search: (old) => old,
            params: (old) => ({ ...old, itemRelativePath: item.relativePath }),
            replace: true,
            resetScroll: false,
          })}
        />
      </ReactModal>
      <Outlet />
    </>
  );
}
