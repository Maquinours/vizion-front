import { Link } from '@tanstack/react-router';

const routePath = '/app/enterprises';

export default function AppViewEnterprisesViewButtonsComponent() {
  return (
    <div className="flex justify-end gap-x-4">
      <Link from={routePath} to="create" search replace resetScroll={false} preload="intent" className="btn btn-secondary">
        Ajouter une entreprise
      </Link>
    </div>
  );
}
