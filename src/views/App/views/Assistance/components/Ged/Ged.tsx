import GedComponent from '../../../../../../components/Ged/Ged';
import FileType from '../../../../../../utils/enums/FileType';
import TechnicalSupportResponseDto from '../../../../../../utils/types/TechnicalSupportResponseDto';
import styles from './Ged.module.scss';

type AppViewAssistanceViewGedComponentProps = Readonly<{ assistance: TechnicalSupportResponseDto }>;
export default function AppViewAssistanceViewGedComponent({ assistance }: AppViewAssistanceViewGedComponentProps) {
  return (
    <GedComponent
      type={FileType.ASSISTANCE}
      id={assistance.id}
      className={styles.card}
      getCreateDirectoryLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-ged-directory',
        params: (old) => old,
        search: (old) => ({ ...old, relativePath: data?.relativePath }),
        replace: true,
        resetScroll: false,
      })}
      getImportFilesLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/import-ged-files',
        params: (old) => old,
        search: (old) => ({ ...old, directoryRelativePath: data?.relativePath }),
        replace: true,
        resetScroll: false,
      })}
      getRenameLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/rename-ged-object/$objectRelativePath',
        params: (old) => ({ ...old, objectRelativePath: data.relativePath }),
        search: (old) => old,
        replace: true,
        resetScroll: false,
      })}
      getDeleteLink={(data) => ({
        to: '/app/businesses-rma/business/$businessId/assistance/$assistanceId/delete-ged-object/$objectRelativePath',
        params: (old) => ({ ...old, objectRelativePath: data.relativePath }),
        search: (old) => old,
        replace: true,
        resetScroll: false,
      })}
    />
  );
}
