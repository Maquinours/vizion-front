import KeycloakEvent from '../../../../../../../../utils/enums/KeycloakEvent';

export const KEYCLOACK_STATES = [
  {
    value: KeycloakEvent.LOGIN,
    color: '#5DC896',
    label: 'Connexion',
  },
  {
    value: KeycloakEvent.LOGIN_ERROR,
    color: '#F24C52',
    label: 'Erreur de connexion',
  },
  {
    value: KeycloakEvent.LOGOUT,
    color: '#F2994A',
    label: 'Déconnexion',
  },
];
