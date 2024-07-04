import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import styles from './ContactsCell.module.scss';

type AppViewEnterprisesViewTableComponentContactsCellComponentProps = Readonly<{
  row: Row<EnterpriseResponseDto>;
  onContactContextMenu: (e: React.MouseEvent, contact: ProfileResponseDto) => void;
}>;

export default function AppViewEnterprisesViewTableComponentContactsCellComponent({
  row: { original },
  onContactContextMenu,
}: AppViewEnterprisesViewTableComponentContactsCellComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <ul className={styles.container} onClick={onClick}>
      {original.profiles.length > 1 && !isOpen ? (
        <li>
          <button onClick={() => setIsOpen(true)}>
            <span>{original.profiles.length} contacts</span>
            <IoMdArrowDropright />
          </button>
        </li>
      ) : (
        original.profiles.map((contact, index, arr) => {
          const isDropDownItem = index === 0 && arr.length > 1;
          const children = (
            <li key={contact.id} onContextMenu={(e) => onContactContextMenu(e, contact)}>
              <span>{contact.landlinePhoneNumber}</span>
              <span>
                {contact.standardPhoneNumber ? (
                  <a
                    href={`tel:${contact.standardPhoneNumber}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  >
                    {contact.firstName} {contact.lastName}
                  </a>
                ) : (
                  <>
                    {contact.firstName} {contact.lastName}
                  </>
                )}
                {isDropDownItem && <IoMdArrowDropdown />}
              </span>
            </li>
          );
          if (isDropDownItem) return <button onClick={() => setIsOpen(false)}>{children}</button>;
          return children;
        })
      )}
    </ul>
  );
}
