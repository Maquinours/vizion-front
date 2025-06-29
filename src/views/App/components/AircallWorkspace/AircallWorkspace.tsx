import { useEffect } from 'react';
import AircallIcon from '../../../../assets/images/aircall-icon.svg?react';
import AircallWorkspace from 'aircall-everywhere';
import { useState } from 'react';
import classNames from 'classnames';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { AircallWorkspaceContext } from './utils/context';
import { useWindowSize } from 'usehooks-ts';

type AppViewAircallWorkspaceComponentProps = Readonly<{
  children: React.ReactNode;
}>;
export default function AppViewAircallWorkspaceComponent({ children }: AppViewAircallWorkspaceComponentProps) {
  const [isWorkspaceOpened, setIsWorkspaceOpened] = useState(false);
  const [aircallWorkspace, setAircallWorkspace] = useState<AircallWorkspace | null>(null);

  const { width } = useWindowSize();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const onButtonClick = () => {
    setIsWorkspaceOpened((isWorkspaceOpened) => !isWorkspaceOpened);
  };

  const dialNumber = (phoneNumber: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      aircallWorkspace?.send('dial_number', { phone_number: phoneNumber }, (success, data) => {
        console.log('Dial number', success, data);
        if (success) {
          setIsWorkspaceOpened(true);
          resolve();
        } else reject(new Error(data));
      });
    });
  };

  const isLoggedIn = (callback: (loggedIn: boolean) => void) => {
    aircallWorkspace?.isLoggedIn(callback);
  };

  useEffect(() => {
    const aircallWorkspace = new AircallWorkspace({
      domToLoadWorkspace: '#aircall-workspace',
      onLogin: () => {
        console.log('Aircall workspace logged in');
      },
      onLogout: () => {
        // ...
      },
    });
    aircallWorkspace.on('incoming_call', () => {
      setIsWorkspaceOpened(true);
    });
    setAircallWorkspace(aircallWorkspace);
  }, []);

  return (
    <AircallWorkspaceContext.Provider value={{ dialNumber, isLoggedIn }}>
      <div
        className={classNames('fixed bottom-4 left-4 z-[999999]', { hidden: !authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || width < 768 })}
      >
        <div id="aircall-workspace" className={classNames('top-6 overflow-hidden rounded-md', { hidden: !isWorkspaceOpened })} />
        <div className="flex w-fit flex-col items-center">
          <div
            className={classNames('h-0 w-0 border-r-4 border-b-4 border-l-4 border-transparent border-b-[var(--grey-line)]', { hidden: !isWorkspaceOpened })}
          />
          <button onClick={onButtonClick}>
            <AircallIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
      {children}
    </AircallWorkspaceContext.Provider>
  );
}
