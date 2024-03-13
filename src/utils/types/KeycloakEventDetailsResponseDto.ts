import KeycloakEvent from '../enums/KeycloakEvent';

type KeycloakEventDetailsResponseDto = {
  id: string;
  type: KeycloakEvent | null;
  realm: string | null;
  userId: string | null;
  ipAddress: string | null;
  clientId: string | null;
  sessionId: string | null;
  error: string | null;
  time: Date | null;
  username: string | null;
  details: Map<string, object> | null;
  fullName: string | null;
  city: string | null;
  area: string | null;
  state: string | null;
  country: string | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string;
  modifiedBy: string | null;
};

export default KeycloakEventDetailsResponseDto;
