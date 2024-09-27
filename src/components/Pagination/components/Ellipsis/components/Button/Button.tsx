type PaginationComponentEllipsisComponentButtonComponentProps = Readonly<{
  onClick: () => void;
}>;
export default function PaginationComponentEllipsisComponentButtonComponent({ onClick }: PaginationComponentEllipsisComponentButtonComponentProps) {
  return (
    <button type="button" className="h-full w-full" onClick={onClick}>
      ...
    </button>
  );
}
