import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewSerialNumbersModalView from '../../../../views/App/views/Products/views/SerialNumbersModal/SerialNumbersModal';

export const Route = createLazyFileRoute('/app/products/serial-numbers')({
  component: AppViewProductsViewSerialNumbersModalView,
});
