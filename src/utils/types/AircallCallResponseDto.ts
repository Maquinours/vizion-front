import AircallContactResponseDto from './AircallContactResponseDto';
import AircallNumberResponseDto from './AircallNumberResponseDto';
import AircallTeamResponseDto from './AircallTeamResponseDto';
import AircallUserResponseDto from './AircallUserResponseDto';

export default interface AircallCallResponseDto {
  id: number;
  sid: string;
  call_uuid: string;
  direct_link: string;
  started_at: number;
  answered_at: number;
  ended_at: number;
  duration: number;
  status: 'initial' | 'answered' | 'done';
  direction: 'inbound' | 'outbound';
  raw_digits: 'anonymous' | string;
  asset: string;
  recording: string;
  recording_short_url: string;
  voicemail: string;
  voicemail_short_url: string;
  archived: boolean;
  missed_call_reason: 'out_of_opening_hours' | 'short_abandoned' | 'abandoned_in_ivr' | 'abandoned_in_classic' | 'no_available_agent' | 'agents_did_not_answer';
  cost: string;
  number: AircallNumberResponseDto;
  user: AircallUserResponseDto;
  contact: AircallContactResponseDto | null;
  assigned_to: AircallUserResponseDto;
  teams: Array<AircallTeamResponseDto>;
  transferred_by: AircallUserResponseDto;
  transferred_to: AircallUserResponseDto;
  external_transferred_to?: string;
  comments: Array<object>; // TODO: Comments
  tags: Array<object>; // TODO: Tags
  participants: Array<object>; // TODO: Participants
  ivr_options_selected: Array<object>; // TODO: IVR options selected
}
