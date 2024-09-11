import { useMutation, useQueryClient } from '@tanstack/react-query';
import { indexAllBusinesses } from '../../../../../../../../utils/api/allBusiness';
import { toast } from 'react-toastify';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

export default function AppViewBusinessesRmaViewButtonsSectionComponentIndexingButtonComponent() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => indexAllBusinesses(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      toast.success('Les affaires ont été indexées avec succès');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'indexation des affaires");
    },
  });

  return (
    <button className="btn btn-secondary" disabled={isPending} onClick={() => mutate()}>
      {isPending ? 'Indexation en cours...' : 'Réindexer les affaires'}
    </button>
  );
}
