import { Row } from '@tanstack/react-table';
import { useContext, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import styles from './ContactsCell.module.scss';
import { AircallWorkspaceContext } from '../../../../../../components/AircallWorkspace/utils/context';

type AppViewEnterprisesViewTableComponentContactsCellComponentProps = Readonly<{
  row: Row<EnterpriseResponseDto>;
  onContactContextMenu: (e: React.MouseEvent, contact: ProfileResponseDto) => void;
}>;

export default function AppViewEnterprisesViewTableComponentContactsCellComponent({
  row: { original },
  onContactContextMenu,
}: AppViewEnterprisesViewTableComponentContactsCellComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { dialNumber } = useContext(AircallWorkspaceContext)!;

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const onCallNumber = (number: string) => {
    if (number) {
      dialNumber(number).catch(() => {
        window.location.href = `tel:${number}`;
      });
    }
  };

  return (
    <button type="button" className="h-fit w-full cursor-default" onClick={onClick}>
      <div className={styles.container}>
        {original.profiles.length > 1 && !isOpen ? (
          <div className="flex flex-row" onClick={() => setIsOpen(true)}>
            <div className="flex-1 text-right">
              <span>{original.profiles.length} contacts</span>
            </div>
            <div>
              <IoMdArrowDropright />
            </div>
          </div>
        ) : (
          original.profiles.map((contact, index, arr) => {
            const isDropDownItem = index === 0 && arr.length > 1;
            return (
              <div
                key={contact.id}
                onContextMenu={(e) => onContactContextMenu(e, contact)}
                onClick={() => isDropDownItem && setIsOpen(false)}
                className="flex flex-row"
              >
                <div className="w-[45%] p-1">
                  <span>{contact.landlinePhoneNumber}</span>
                </div>
                <div className="w-[45%] p-1">
                  {contact.standardPhoneNumber ? (
                    <a
                      href={`tel:${contact.standardPhoneNumber!}`}
                      onClick={(e) => {
                        onClick(e);
                        e.preventDefault();
                        onCallNumber(contact.standardPhoneNumber!);
                      }}
                      className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                    >
                      {contact.firstName} {contact.lastName}
                    </a>
                  ) : (
                    <span>
                      {contact.firstName} {contact.lastName}
                    </span>
                  )}
                </div>
                <div className="w-[10%] p-1">{isDropDownItem && <IoMdArrowDropdown />}</div>
              </div>
            );
          })
        )}
      </div>
    </button>
  );
}
