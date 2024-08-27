import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewSerialNumbersModalViewRemoveFromBusinessModalView from '../../../../../views/App/views/Products/views/SerialNumbersModal/views/RemoveFromBusinessModal/RemoveFromBusinessModal';

export const Route = createLazyFileRoute('/app/products/serial-numbers/remove-from-business/$serialNumberId')({
  component: AppViewProductsViewSerialNumbersModalViewRemoveFromBusinessModalView,
});
