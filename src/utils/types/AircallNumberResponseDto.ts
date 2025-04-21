import AircallUserResponseDto from './AircallUserResponseDto';

export default interface AircallNumberResponseDto {
  id: number;
  direct_link: string;
  name: string;
  digits: string;
  e164_digits: string;
  created_at: string;
  country: string;
  time_zone: string;
  open: boolean;
  availability_status: 'open' | 'custom' | 'closed';
  is_ivr: boolean;
  live_recording_activated: boolean;
  users: Array<AircallUserResponseDto>;
  priority: 0 | 1 | null;
  messages: object; // TODO: Music and Messages
}
