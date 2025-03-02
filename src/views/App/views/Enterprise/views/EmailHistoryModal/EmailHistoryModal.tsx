import { getRouteApi, LinkProps } from '@tanstack/react-router';
import MailResponseDto from '../../../../../../utils/types/MailResponseDto';
import EmailHistoryModalComponent from '../../../../../../components/EmailHistoryModal/EmailHistoryModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/email-history');
const routePath = '/app/enterprises/$enterpriseId/email-history';

export default function AppViewEnterpriseViewEmailHistoryModalView() {
  const navigate = routeApi.useNavigate();

  const { page, addresses } = routeApi.useSearch();

  const { size } = routeApi.useLoaderDeps();

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, page: undefined, addresses: undefined }), replace: true, resetScroll: false });
  };

  const onSubmit = ({ addresses }: { addresses: Array<string> }) => {
    navigate({ search: (old) => ({ ...old, page: undefined, addresses: addresses }), replace: true, resetScroll: false });
  };

  const getEmailLink = (email: MailResponseDto) =>
    ({
      to: `${routePath}/email/$emailId`,
      params: { emailId: email.id },
      search: true,
      replace: true,
      resetScroll: false,
    }) as LinkProps<typeof routeApi>;

  const getPageLink = (page: number) =>
    ({
      from: routePath,
      search: (old) => ({ ...old, page: page }),
      replace: true,
      resetScroll: false,
    }) as LinkProps<typeof routeApi>;

  return (
    <EmailHistoryModalComponent
      page={page}
      size={size}
      addresses={addresses ?? []}
      onClose={onClose}
      onSubmit={onSubmit}
      getEmailLink={getEmailLink}
      getPageLink={getPageLink}
    />
  );
}
