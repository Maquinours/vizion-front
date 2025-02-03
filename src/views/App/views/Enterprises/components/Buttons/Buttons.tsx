import { Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routePath = '/app/enterprises';

export default function AppViewEnterprisesViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <div className="flex justify-end gap-x-4">
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <Link from={routePath} to="create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Ajouter une entreprise
        </Link>
      )}
    </div>
  );
}
