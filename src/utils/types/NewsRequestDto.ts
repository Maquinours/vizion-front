type NewsRequestDto = {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  files?: Record<string, object> | null;
  archived?: boolean | null;
};

export default NewsRequestDto;
