import AircallPhone from 'aircall-everywhere';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

export default function AppViewAircallIntegrationComponent() {
  const [show, setShow] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    const phone = new AircallPhone({
      domToLoadPhone: '#phone',
      onLogin: (settings) => {
        console.log('onLogin', settings);
        // ...
      },
      onLogout: () => {
        console.log('onLogout');
        // ...
      },
    });

    phone.on('incoming_call', (callInfos) => {
      console.log('incoming_call', callInfos);
      setShow(true);
    });
    phone.on('call_end_ringtone', (callInfos) => {
      console.log('call_end_ringtone', callInfos);
    });
    phone.on('outgoing_call', (callInfos) => {
      console.log('outgoing_call', callInfos);
    });
    phone.on('outgoing_answered', (callInfos) => {
      console.log('outgoing_answered', callInfos);
    });
    phone.on('call_ended', (callInfos) => {
      console.log('call_ended', callInfos);
    });
    phone.on('comment_saved', (callInfos) => {
      console.log('comment_saved', callInfos);
    });
    phone.on('redirect_event', (callInfos) => {
      console.log('redirect_event', callInfos);
    });

    return () => {
      phone.removeListener('incoming_call');
      phone.removeListener('call_end_ringtone');
      phone.removeListener('outgoing_call');
      phone.removeListener('outgoing_answered');
      phone.removeListener('call_ended');
      phone.removeListener('comment_saved');
      phone.removeListener('redirect_event');
    };
  }, []);

  const onClick = () => {
    setShow(!show);
  };

  return (
    <div className={classNames('fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end', { hidden: windowWidth < 400 || windowHeight < 800 })}>
      <div id="phone" className={classNames('rounded border border-solid border-[var(--grey-line)] bg-white shadow', { hidden: !show })}></div>
      <div className={classNames('w-8', { hidden: !show })}>
        <div className="m-auto h-0 w-0 border-x-8 border-t-8 border-solid border-x-transparent border-t-[var(--primary-color)]" />
      </div>
      <button type="button" onClick={onClick} className={classNames({ hidden: windowWidth < 400 || windowHeight < 800 })}>
        <img src="https://aircall.github.io/aircall-everywhere/images/aircall-icon.svg" alt="Logo Aircall" width={32} height={32} />
      </button>
    </div>
  );
}
