import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewSerialNumbersModalViewCreateRmaModalView from '../../../../../views/App/views/Products/views/SerialNumbersModal/views/CreateRmaModal/CreateRmaModal';

export const Route = createLazyFileRoute('/app/products/serial-numbers/create-rma/$serialNumberId')({
  component: AppViewProductsViewSerialNumbersModalViewCreateRmaModalView,
});
