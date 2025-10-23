import { useEffect } from 'react';
import AircallIcon from '../../../../assets/images/aircall-icon.svg?react';
import AircallWorkspace from 'aircall-everywhere';
import { useState } from 'react';
import classNames from 'classnames';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { AircallWorkspaceContext } from './utils/context';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';

type AppViewAircallWorkspaceComponentProps = Readonly<{
  children: React.ReactNode;
}>;
export default function AppViewAircallWorkspaceComponent({ children }: AppViewAircallWorkspaceComponentProps) {
  const [isWorkspaceOpened, setIsWorkspaceOpened] = useState(false);
  const [aircallWorkspace, setAircallWorkspace] = useState<AircallWorkspace | null>(null);

  const [size, setSize] = useLocalStorage('preferences.aircall.workspace.size', { width: 376, height: 666 });

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

  const onResize = (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setSize({ width: size.width, height: size.height });
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
      size: 'auto',
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
        <ResizableBox
          height={size.height}
          width={size.width}
          onResize={onResize}
          // handle={(h, ref) => <span className={`custom-handle custom-handle-${h}`} ref={ref} />}
          // handleSize={[8, 8]}
          maxConstraints={[1600, 800]}
          resizeHandles={['ne', 'e', 'n']}
          className={classNames({ hidden: !isWorkspaceOpened })}
        >
          <div id="aircall-workspace" className="top-6 h-full w-full overflow-hidden rounded-md" />
        </ResizableBox>
        <div className="flex w-fit flex-col items-center">
          <div
            className={classNames('h-0 w-0 border-r-4 border-b-4 border-l-4 border-transparent border-b-(--grey-line)', { hidden: !isWorkspaceOpened })}
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
