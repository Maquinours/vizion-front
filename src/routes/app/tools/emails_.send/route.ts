import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/app/tools/emails/send')({
  staticData: {
    title: 'Nouvel email',
  },
});
