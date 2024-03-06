import TaskState from '../enums/TaskState';
import WorkloadType from '../enums/WorkloadType';

type TaskResponseDto = {
  id: string;
  enterpriseName: string | null;
  businessName: string | null;
  businessNum: string | null;
  rmaNum: string | null;
  name: string | null;
  receiver: Record<string, object> | null;
  content: string | null;
  state: TaskState | null;
  senderState: TaskState | null;
  receiverState: TaskState | null;
  type: WorkloadType | null;
  head: TaskResponseDto;
  deadline: string | null;
  profileId: string | null;
  senderId: string | null;
  businessId: string | null;
  mailId: string | null;
  mailHashId: string | null;
  rmaId: string | null;
  rdvId: string | null;
  productId: string | null;
  enterpriseId: string | null;
  reference: string | null;
  taskOpened: boolean | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default TaskResponseDto;
