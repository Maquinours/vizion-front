import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'moment/dist/locale/fr';
import * as Sentry from '@sentry/react';
import { fr } from 'date-fns/locale/fr';
import { registerLocale } from 'react-datepicker';
import { router } from './router.tsx';
import 'react-quill-new/dist/quill.snow.css';

moment.locale('fr');

ReactModal.setAppElement('#app');

registerLocale('fr', fr);

Sentry.init({
  dsn: 'https://ee81b77d4c591be8a8d86f2a7b1dbc00@o4507100733964288.ingest.de.sentry.io/4507100746350672',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.replayCanvasIntegration(),
    Sentry.tanstackRouterBrowserTracingIntegration(router),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: 'system',
      showBranding: false,
      triggerLabel: 'Signaler un bug',
      formTitle: 'Signaler un bug',
      nameLabel: 'Nom',
      namePlaceholder: 'Entrez votre nom',
      emailLabel: 'Adresse email',
      emailPlaceholder: 'Entrez votre addresse email',
      messageLabel: 'Description du bug',
      isRequiredLabel: '(requis)',
      messagePlaceholder: 'Entrez une description du bug rencontré.',
      addScreenshotButtonLabel: "Ajouter une capture d'écran",
      removeScreenshotButtonLabel: "Supprimer la capture d'écran",
      submitButtonLabel: 'Envoyer le signalement',
      cancelButtonLabel: 'Annuler',
      successMessageText: 'Votre signalement a bien été envoyé. Merci pour votre aide !',
      showName: false,
      showEmail: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['https://test-vizion.vizeo.eu', 'https://vizion.vizeo.eu'],
  // Session Replay
  replaysSessionSampleRate: import.meta.env.DEV ? 0 : 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: import.meta.env.DEV ? 0 : 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: import.meta.env.MODE,
});

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
