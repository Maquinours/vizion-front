import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewUpdateModalView from "../../../../views/App/views/Faq/views/UpdateModal/UpdateModal";

export const Route = createLazyFileRoute('/app/faq/update/$faqId')({
  component: AppViewFaqViewUpdateModalView,
});
