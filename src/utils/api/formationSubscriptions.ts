import { privateInstance } from '../functions/axios';
import FormationSubscriptionResponseDto from '../types/FormationSubscriptionResponseDto';

export const getFormationSubscriptionsByFormationDetailId = (formationId: string) => {
  return privateInstance<Array<FormationSubscriptionResponseDto>>({
    method: 'GET',
    url: `/rdv/v1/formation/subscription/formation/${encodeURIComponent(formationId)}`,
  }).then((res) => res.data);
};

export const getFormationSubscriptionById = (id: string) => {
  return privateInstance<FormationSubscriptionResponseDto>({
    method: 'GET',
    url: `/rdv/v1/formation/subscription/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const deleteFormationSubscription = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/rdv/v1/formation/subscription/${encodeURIComponent(id)}`,
  });
};
