type NewsResponseDto = {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  files: Record<string, object> | null;
  archived: boolean | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default NewsResponseDto;
