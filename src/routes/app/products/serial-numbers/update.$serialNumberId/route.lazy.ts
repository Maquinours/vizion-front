import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewSerialNumbersModalViewUpdateModalView from '../../../../../views/App/views/Products/views/SerialNumbersModal/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/products/serial-numbers/update/$serialNumberId')({
  component: AppViewProductsViewSerialNumbersModalViewUpdateModalView,
});
