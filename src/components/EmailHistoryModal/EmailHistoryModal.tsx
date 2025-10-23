import { useQuery } from '@tanstack/react-query';
import { Link, LinkProps, Outlet, useNavigate, useRouter } from '@tanstack/react-router';
import { createColumnHelper, Row } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import ReactModal from 'react-modal';
import { ReactMultiEmail } from 'react-multi-email';
import styles from './EmailHistoryModal.module.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { PUBLIC_BASE_URL } from '../../utils/constants/api';
import { queries } from '../../utils/constants/queryKeys';
import { formatDateAndHourWithSlash } from '../../utils/functions/dates';
import MailResponseDto from '../../utils/types/MailResponseDto';
import PaginationComponent from '../Pagination/Pagination';
import TableComponent from '../Table/Table';
import 'react-multi-email/dist/style.css';

const columnHelper = createColumnHelper<MailResponseDto>();

const yupSchema = yup.object().shape({
  addresses: yup.array().of(yup.string().email("L'email n'est pas valide").required('Veuillez entrer une valeur')).required(),
});

const getEmailLabel = (email: string, index: number, removeEmail: (index: number, isDisabled?: boolean) => void) => (
  <div data-tag key={index}>
    <div data-tag-item>{email}</div>
    <button type="button" data-tag-handle onClick={() => removeEmail(index)}>
      ×
    </button>
  </div>
);

type EmailHistoryModalComponentProps = Readonly<{
  page: number;
  size: number;
  addresses: Array<string>;
  onClose: () => void;
  onSubmit: (data: yup.InferType<typeof yupSchema>) => void;
  getEmailLink?: (email: MailResponseDto) => LinkProps;
  onEmailClick?: (email: MailResponseDto) => void;
  getPageLink?: (page: number) => LinkProps;
  onPageChange?: (page: number) => void;
}>;
export default function EmailHistoryModalComponent({
  page,
  size,
  addresses,
  onClose,
  onSubmit,
  getEmailLink,
  onEmailClick,
  getPageLink,
  onPageChange,
}: EmailHistoryModalComponentProps) {
  const router = useRouter();
  const navigate = useNavigate();

  const {
    control,
    reset,
    formState: { isDirty, errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      addresses: [],
    },
  });

  const { data, isLoading } = useQuery(queries.emails.page._ctx.byEmailAddresses(addresses ?? [], { page, size }));

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: "Date & heure de l'envoi",
        cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.sendDate),
      }),
      columnHelper.display({
        header: 'Expéditeur',
        cell: ({ row: { original } }) => original.sender,
      }),
      columnHelper.display({
        header: 'Destinataire(s)',
        cell: ({ row: { original } }) => (
          <ul>
            {original.receiver.split(';').map((item, key) => (
              <li key={key}>{item}</li>
            ))}
          </ul>
        ),
      }),
      columnHelper.display({
        header: 'Objet',
        cell: ({ row: { original } }) => {
          const children = original.subject;
          if (getEmailLink && onEmailClick) throw new Error('getEmailLink and onEmailClick cannot be both defined');

          if (getEmailLink)
            return (
              <Link
                {...getEmailLink(original)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {children}
              </Link>
            );
          else if (onEmailClick)
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmailClick(original);
                }}
              >
                {children}
              </button>
            );
          else throw new Error('getEmailLink or onEmailClick must be defined');
        },
        // <Link
        //   {...getEmailLink(original)}
        //   onClick={(e) => {
        //     e.stopPropagation();
        //   }}
        // >
        //   {original.subject}
        // </Link>;
        // },
      }),
      columnHelper.display({
        header: 'Pièces jointes',
        cell: ({ row: { original } }) =>
          original.pjList.length > 0 && (
            <div className="flex flex-col gap-y-1">
              {original.pjList.map((item) => (
                <a
                  key={item.id}
                  href={`${PUBLIC_BASE_URL}mail/v1/download-file/${item.name}?ref=${original.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          ),
      }),
      columnHelper.display({
        id: 'scrollbar_compensator',
      }),
    ],
    [getEmailLink],
  );

  const onRowClick = (e: React.MouseEvent, row: Row<MailResponseDto>) => {
    if (getEmailLink && onEmailClick) throw new Error('getEmailLink and onEmailClick cannot be both defined');

    if (getEmailLink) {
      const emailLink = getEmailLink(row.original);
      if (e.metaKey || e.ctrlKey) {
        const location = router.buildLocation(emailLink);
        window.open(location.href, '_blank');
      } else navigate(emailLink);
    } else if (onEmailClick) onEmailClick(row.original);
    else throw new Error('getEmailLink or onEmailClick must be defined');
  };

  useEffect(() => {
    if (!isDirty)
      reset({
        addresses: addresses ?? [],
      });
  }, [addresses]);

  return (
    <>
      <ReactModal isOpen className={styles.modal} onRequestClose={onClose} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Historique des mails</h6>
          </div>
          <div className={styles.modal_content}>
            <div className="mb-2 flex flex-row items-center gap-x-1 self-end text-(--primary-color)">
              <span className="font-semibold">Adresses recherchées :</span>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-x-2">
                <div className="flex w-96 flex-col gap-y-1">
                  <Controller
                    control={control}
                    name="addresses"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <ReactMultiEmail emails={value} onChange={onChange} onBlur={onBlur} getLabel={getEmailLabel} />
                    )}
                  />
                  <span className="text-(--secondary-color)">{errors.addresses?.message}</span>
                </div>
                <button type="submit" className="btn btn-secondary w-fit self-center">
                  Rechercher
                </button>
              </form>
            </div>
            <div className={styles.table_container}>
              <TableComponent columns={columns} data={data?.content} isLoading={isLoading} onRowClick={onRowClick} />
            </div>
            <PaginationComponent page={page} totalPages={data?.totalPages} pageLink={getPageLink} onPageChange={onPageChange} />

            <div className={styles.modal_buttons}>
              <button className="btn btn-secondary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
