import { createLazyFileRoute } from "@tanstack/react-router";
import AppViewProductsViewSerialNumbersModalViewCreateModalView from "../../../../../views/App/views/Products/views/SerialNumbersModal/views/CreateModal/CreateModal";

export const Route = createLazyFileRoute('/app/products/serial-numbers/create')({
    component: AppViewProductsViewSerialNumbersModalViewCreateModalView
})