import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'moment/dist/locale/fr';

moment.locale('fr');

ReactModal.setAppElement('#app');

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
