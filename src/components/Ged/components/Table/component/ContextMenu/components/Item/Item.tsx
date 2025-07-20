import { MenuItem } from '@mui/material';
import { Link, LinkOptions } from '@tanstack/react-router';

type GedComponentTableComponentContextMenuComponentItemComponentProps = Readonly<{
  link?: LinkOptions;
  onClick?: () => void;
  onClose: () => void;
  children: React.ReactNode;
  show: boolean;
}>;
export default function GedComponentTableComponentContextMenuComponentItemComponent({
  link,
  onClick,
  onClose,
  children: subChildren,
  show,
}: GedComponentTableComponentContextMenuComponentItemComponentProps) {
  if (!show) return null;

  const children = (() => {
    if (link && onClick) throw new Error('link and onClick cannot be both defined');

    if (link)
      return (
        <Link {...link} preload="intent" onClick={onClose}>
          {subChildren}
        </Link>
      );
    else if (onClick)
      return (
        <button
          type="button"
          onClick={() => {
            onClick();
            onClose();
          }}
        >
          {subChildren}
        </button>
      );
    else throw new Error('getLink or onClick must be defined');
  })();

  return <MenuItem>{children}</MenuItem>;
}
