import { useRouterState } from '@tanstack/react-router';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    '0': '#9fa5b9',
    '1.0': '#31385a',
  },
});

export default function AppViewLoadingProgressBarComponent() {
  const isLoading = useRouterState({ select: (state) => state.isLoading });

  if (isLoading) return <TopBarProgress />;
}