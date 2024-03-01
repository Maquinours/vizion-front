import styles from './Topbar.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayoutTopbarComponentBasicTopbarComponent from './components/BasicTopbar/BasicTopbar';
import AppLayoutTopbarComponentMobileTopbar from './components/MobileTopbar/MobileTopbar';
import { logoutUser } from './utils/api/logout';
import { useNavigate } from '@tanstack/react-router';
import { removeToken } from '../../../../utils/functions/token';

export default function AppViewTopbarComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => {
      logoutUser();
      return Promise.resolve();
    },
    onSettled: () => {
      removeToken();
      navigate({ to: '/auth/login' });
      queryClient.clear();
    },
  });

  return (
    <div className={styles.topbar}>
      <div className={styles.content}>
        <AppLayoutTopbarComponentBasicTopbarComponent logout={mutate} />
        <AppLayoutTopbarComponentMobileTopbar logout={mutate} />
      </div>
    </div>
  );
}
