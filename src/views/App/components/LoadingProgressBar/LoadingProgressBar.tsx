import { useRouterState } from '@tanstack/react-router';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#fbfcfe',
    '1.0': '#16204e',
  },
});

export default function AppViewLoadingProgressBarComponent() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  if (isLoading) return <TopBarProgress />;
}
