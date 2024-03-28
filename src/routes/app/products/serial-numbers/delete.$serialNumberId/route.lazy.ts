import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewSerialNumbersModalViewDeleteModalView from '../../../../../views/App/views/Products/views/SerialNumbersModal/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/products/serial-numbers/delete/$serialNumberId')({
  component: AppViewProductsViewSerialNumbersModalViewDeleteModalView,
});
