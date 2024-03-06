import WorkloadType from '../enums/WorkloadType';

type TaskRequestDto = {
  name?: string | null;
  enterpriseName?: string | null;
  businessName?: string | null;
  content: string;
  type: WorkloadType;
  headTaskId?: string | null;
  rdvId?: string | null;
  deadline?: Date | null;
  profileId?: string | null;
  senderId?: string | null;
  businessId?: string | null;
  rmaId?: string | null;
  mailId?: string | null;
  mailHashId?: string | null;
  businessNum?: string | null;
  rmaNum?: string | null;
  comment?: string | null;
  author?: string | null;
  receiver?: Record<string, object> | null;
  productId?: string | null;
  enterpriseId?: string | null;
  reference?: string | null;
  copy?: boolean | null;
};

export default TaskRequestDto;
