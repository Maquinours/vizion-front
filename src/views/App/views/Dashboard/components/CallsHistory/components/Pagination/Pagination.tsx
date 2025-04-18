import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';

interface AppViewDashboardViewCallsHistoryComponentPaginationComponentProps {
  page: number;
  totalPages?: number;
}
export default function AppViewDashboardViewCallsHistoryComponentPaginationComponent({
  page,
  totalPages,
}: AppViewDashboardViewCallsHistoryComponentPaginationComponentProps) {
  return (
    <PaginationComponent page={page} totalPages={totalPages} pageLink={(page) => ({ search: { callsHistoryPage: page }, replace: true, resetScroll: false })} />
  );
}
