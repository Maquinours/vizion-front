import React, { useMemo } from 'react';
import { HashLoader, PacmanLoader, ScaleLoader } from 'react-spinners';
import styles from './Loader.module.scss';

const loaders = [
  <HashLoader key={0} size={70} color="#16204E" loading={true} />,
  <ScaleLoader key={1} color="#F24C52" height={40} width={6} loading={true} />,
  <PacmanLoader key={2} color="#31385A" size={30} loading={true} />,
];

export default function Loader() {
  const randomLoader = useMemo(() => loaders[Math.floor(Math.random() * loaders.length)], []);

  return (
    <div className={styles.container}>
      <div className={styles.loader}>{randomLoader}</div>
    </div>
  );
}
