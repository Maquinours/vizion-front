import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewDeleteModalView from "../../../../views/App/views/Faq/views/DeleteModal/DeleteModal";

export const Route = createLazyFileRoute('/app/faq/delete/$faqId')({
  component: AppViewFaqViewDeleteModalView,
});
