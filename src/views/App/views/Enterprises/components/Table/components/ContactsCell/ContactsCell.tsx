import { Row } from '@tanstack/react-table';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import { useState } from 'react';
import styles from './ContactsCell.module.scss';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { VirtualElement } from '@popperjs/core';
import AppViewEnterprisesViewTableComponentContactsCellComponentContextMenuComponent from './components/ContextMenu/ContextMenu';

type AppViewEnterprisesViewTableComponentContactsCellComponentProps = Readonly<{ row: Row<EnterpriseResponseDto> }>;

export default function AppViewEnterprisesViewTableComponentContactsCellComponent({
  row: { original },
}: AppViewEnterprisesViewTableComponentContactsCellComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [contact, setContact] = useState<ProfileResponseDto>();

  const onContactContextMenu = (e: React.MouseEvent, contact: ProfileResponseDto) => {
    e.preventDefault();
    setContact(contact);
    setContextMenuAnchor({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  };

  return (
    <>
      <ul className={styles.container}>
        {original.profiles.length > 1 && !isOpen ? (
          <li>
            <div>
              <span>{original.profiles.length} contacts</span>
              <button onClick={() => setIsOpen(true)}>
                <IoMdArrowDropright />
              </button>
            </div>
          </li>
        ) : (
          original.profiles.map((contact, index, arr) => (
            <li key={contact.id} onContextMenu={(e) => onContactContextMenu(e, contact)}>
              <span>{contact.landlinePhoneNumber}</span>
              <span>
                {contact.standardPhoneNumber ? (
                  <a href={`tel:${contact.standardPhoneNumber}`}>
                    {contact.firstName} {contact.lastName}
                  </a>
                ) : (
                  <>
                    {contact.firstName} {contact.lastName}
                  </>
                )}
                {index === 0 && arr.length > 1 && (
                  <button onClick={() => setIsOpen(false)}>
                    <IoMdArrowDropdown />
                  </button>
                )}
              </span>
            </li>
          ))
        )}
      </ul>
      <AppViewEnterprisesViewTableComponentContactsCellComponentContextMenuComponent
        contact={contact}
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
      />
    </>
  );
}
