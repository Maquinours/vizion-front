import { getRouteApi, useNavigate } from '@tanstack/react-router';
import React from 'react';
import styles from './TypeSelect.module.scss';

const routeApi = getRouteApi('/app/tools/emails');

const typeOptions = [
  {
    value: 'OTHER',
    text: 'Mails reçus et envoyés',
  },
  {
    value: 'SPAM',
    text: 'Spams',
  },
];

export default function AppViewToolsViewEmailsViewTypeSelectComponent() {
  const navigate = useNavigate({ from: routeApi.id });

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ search: (old) => ({ ...old, spam: e.target.value === 'SPAM' ? true : undefined, page: 0 }) });
  };

  return (
    <div className={styles.type_container}>
      <select defaultValue="OTHER" onChange={onTypeChange}>
        {typeOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.text}
          </option>
        ))}
      </select>
    </div>
  );
}
