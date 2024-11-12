import { getRouteApi, Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';

const routeApi = getRouteApi('/app/faq');

export default function AppViewFaqViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { archived } = routeApi.useSearch();

  return (
    <div>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <Link from={routeApi.id} to="./create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
          Ajouter
        </Link>
      )}
      <Link
        from={routeApi.id}
        search={(old) => ({ ...old, archived: !archived })}
        replace
        resetScroll={false}
        className="btn btn-secondary"
        style={{ marginLeft: '3px' }}
      >
        {archived ? 'Voir non archivés' : 'Voir archivés'}
      </Link>
    </div>
  );
}
