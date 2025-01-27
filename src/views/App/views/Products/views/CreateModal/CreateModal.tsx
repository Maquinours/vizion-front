import { getRouteApi } from '@tanstack/react-router';
import CreateProductModalComponent from '../../../../../../components/CreateProductModal/CreateProductModal';

const routeApi = getRouteApi('/app/products/create');

export default function AppViewProductsViewCreateModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <CreateProductModalComponent onClose={onClose} />;
}
