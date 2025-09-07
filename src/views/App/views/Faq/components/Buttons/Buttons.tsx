import { getRouteApi, Link } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/faq');

export default function AppViewFaqViewButtonsComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { archived } = routeApi.useSearch();

  const { mutate: updateViziaCache, isPending: isUpdatingViziaCache } = useMutation({
    mutationFn: () => {
      return axios.post<{
        success: boolean;
        message: string;
        data: { duration_ms: number; faqs_count: number; categories_count: number; last_update: string; cache_version: string; database_size_bytes: number };
        timestamp: string;
        server: string;
      }>(
        'https://vizia.vizeo.eu/VF/cache_update_endpoint.php',
        { action: 'update_cache' },
        { headers: { Authorization: 'Bearer VZ_CACHE_UPDATE_2025_SECRET_TOKEN_123456' } },
      );
    },
    onSuccess: (response) => {
      if(response.data.success)
        toast.success(`Cache de VIZIA mis à jour avec succès avec ${response.data.data.faqs_count} FAQs`);
      else if(!response.data.success)
        toast.error(response.data.message);
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du cache');
    },
  });

  return (
    <div className='flex flex-row gap-x-2'>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <>
          <button type="button" className="btn btn-secondary" onClick={() => updateViziaCache()} disabled={isUpdatingViziaCache}>
            Mettre à jour le cache de VIZIA
          </button>
          <Link from={routeApi.id} to="./create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
            Ajouter
          </Link>
        </>
      )}
      <Link
        from={routeApi.id}
        search={(old) => ({ ...old, archived: !archived })}
        replace
        resetScroll={false}
        className="btn btn-secondary"
      >
        {archived ? 'Voir non archivés' : 'Voir archivés'}
      </Link>
    </div>
  );
}
