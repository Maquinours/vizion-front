import { privateInstance } from '../functions/axios';

export const getCommercialNoticesByProductReferences = (references: Array<string>) => {
  return privateInstance<string>({
    method: 'GET',
    url: `/product-free/v1/doc-com`,
    params: {
      refs: references,
    },
  }).then((res) => res.data);
};
