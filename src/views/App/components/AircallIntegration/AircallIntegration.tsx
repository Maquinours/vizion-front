import AircallPhone from 'aircall-everywhere';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

export default function AppViewAircallIntegrationComponent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const phone = new AircallPhone({
      domToLoadPhone: '#phone',
      onLogin: (settings) => {
        console.log('onLogin', settings);
        // ...
      },
      onLogout: () => {
        // ...
      },
    });

    phone.on('incoming_call', (callInfos) => {
      console.log('incoming_call', callInfos);
    });
  }, []);

  const onClick = () => {
    setShow(!show);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end">
      <div id="phone" className={classNames('rounded border border-solid border-[var(--grey-line)] bg-white shadow', { hidden: !show })}></div>
      <div className={classNames('w-8', { hidden: !show })}>
        <div className="m-auto h-0 w-0 border-x-8 border-t-8 border-solid border-x-transparent border-t-[var(--primary-color)]" />
      </div>
      <button type="button" onClick={onClick}>
        <img src="https://aircall.github.io/aircall-everywhere/images/aircall-icon.svg" alt="Logo Aircall" width={32} height={32} />
      </button>
    </div>
  );
}
