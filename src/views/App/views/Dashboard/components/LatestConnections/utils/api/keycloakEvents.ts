import { privateInstance } from '../../../../../../../../utils/functions/axios';
import KeycloakEventDetailsResponseDto from '../../../../../../../../utils/types/KeycloakEventDetailsResponseDto';
import Page from '../../../../../../../../utils/types/Page';

export const getLatestKeycloakEvents = async (page: number, size: number) => {
  return (
    await privateInstance<Page<KeycloakEventDetailsResponseDto>>({
      method: 'GET',
      url: `profile/v1/user-event/find-all`,
      params: {
        page,
        size,
      },
    })
  ).data;
};
