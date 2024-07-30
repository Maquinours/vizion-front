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
    <table className={styles.container} onClick={onClick}>
      {original.profiles.length > 1 && !isOpen ? (
        <tr onClick={() => setIsOpen(true)}>
          <td colSpan={2} className="w-[90%] p-1">
            <span>{original.profiles.length} contacts</span>
          </td>
          <td className="w-[10%] p-1">
            <IoMdArrowDropright />
          </td>
        </tr>
      ) : (
        original.profiles.map((contact, index, arr) => {
          const isDropDownItem = index === 0 && arr.length > 1;
          return (
            <tr key={contact.id} onContextMenu={(e) => onContactContextMenu(e, contact)} onClick={() => isDropDownItem && setIsOpen(false)}>
              <td className="w-[45%] p-1">
                <span>{contact.landlinePhoneNumber}</span>
              </td>
              <td className="w-[45%] p-1">
                {contact.standardPhoneNumber ? (
                  <a
                    href={`tel:${contact.standardPhoneNumber}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
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
              </td>
              <td className="w-[10%] p-1">{isDropDownItem && <IoMdArrowDropdown />}</td>
            </tr>
          );
        })
      )}
    </table>
  );
}
