type ResourceType = 'number' | 'user' | 'contact' | 'call';

type ResourceEventMap = {
  number: 'number.created' | 'number.deleted' | 'number.opened' | 'number.closed';
  user: 'user.created' | 'user.deleted' | 'user.connected' | 'user.disconnected' | 'user.opened' | 'user.closed' | 'user.wut_start' | 'user.wut_end';
  contact: 'contact.created' | 'contact.updated' | 'contact.deleted';
  call:
    | 'call.created'
    | 'call.ringing_on_agent'
    | 'call.agent_declined'
    | 'call.answered'
    | 'call.transferred'
    | 'call.unsuccessful_transfer'
    | 'call.hungup'
    | 'call.ended'
    | 'call.voicemail_left'
    | 'call.assigned'
    | 'call.archived'
    | 'call.tagged'
    | 'call.untagged'
    | 'call.commented'
    | 'call.hold'
    | 'call.unhold'
    | 'call.ivr_option_selected'
    | 'call.comm_assets_generated';
};

interface ClassicNumberMessage {
  /**
   * Ringing tone URL. During an incoming call, caller will hear this music while waiting for the call to be answered.
   * Available for Classic numbers.
   */
  ringing_tone: string;
  /**
   * Unanswered Call message URL. Caller will hear this message if their call is not answered when the business hours are open.
   * Available for Classic numbers.
   */
  unanswered_call: string;
  /**
   * After Hours message URL. Caller will hear this message if they call outside of this number's business hours.
   * Available for Classic numbers.
   */
  after_hours: string;
}

interface IvrNumberMessage {
  /**
   * IVR message URL. Caller will hear this right after the Welcome message. This message will be played twice.
   * Available for IVR numbers.
   */
  ivr: string;
  /**
   * Voicemail message URL. Deprecated: replaced by unanswered_call.
   * Available for IVR numbers.
   */
  voicemail: string;
  /**
   * Closed message URL. Deprecated: replaced by after_hours.
   * Available for IVR numbers.
   */
  closed: string;
  /**
   * Callback Later message.
   * Available for IVR numbers.
   */
  callback_later: string;
}

type Message<IsIvrNumber extends boolean> = {
  /**
   * Welcome message URL. This file is played at the beginning of an incoming call.
   * Available for Classic & IVR numbers.
   */
  welcome: string;
  /**
   * Waiting music URL. Caller will hear this if they are put on hold during an ongoing call or while the call is being transfered.
   * Available for Classic & IVR numbers.
   */
  waiting: string;
} & (IsIvrNumber extends true ? IvrNumberMessage : ClassicNumberMessage);

interface Number<IsIvr extends boolean> {
  /**
   * Unique identifier for the Number.
   */
  id: number;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * The name of the Number.
   */
  name: string;
  /**
   * International format of the Number.
   */
  digits: string;
  /**
   * Number in E.164 format
   * Number in following format [+][country code][area code][local phone number] i.e. without any space or special characters e.g. +18001234567, +33176360695. Only available in Webhook events
   */
  e164_digits: string;
  /**
   * Timestamp when the Number was created, in UTC.
   */
  created_at: string;
  /**
   * ISO 3166-1 alpha-2 country code of the Number.
   * Listed in Wikipedia: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
   */
  country: string;
  /**
   * Number's time zone, set in the Dashboard.
   * More details on Timezones here : https://developer.aircall.io/api-references/#sip-trunking
   */
  time_zone: string;
  /**
   * Current opening state of the Number, based on its opening hours.
   */
  open: boolean;
  /**
   * Current availability status of the Number.
   */
  availability_status: 'open' | 'custom' | 'closed';
  /**
   * true if Number is an IVR, false if Number is a Classic Number.
   * More information on our Knowledge Base : https://help.aircall.io/en/articles/3819483
   */
  is_ivr: IsIvr;
  /**
   * Whether a Number has live recording activated or not.
   * More information on our Knowledge Base : https://help.aircall.io/en/articles/5658190
   */
  live_recording_activated: boolean;
  /**
   * List of Users linked to this Number.
   */
  users: Array<User<AvailabilityStatusType>>;
  /**
   * Priority level of the number used during routing of the calls
   * Can be null, 0 (no priority) or 1 (top priority). Default value is null
   */
  priority: null | 0 | 1;
  /**
   * URL to Number's music & messages files.
   */
  messages: Message<IsIvr>;
}

type AvailabilityStatusType = 'available' | 'custom' | 'unavailable';
type AvailabilityStatusSubstatusMap = {
  available: 'always_open';
  custom: 'always_open';
  unavailable: 'always_closed' | string;
};

interface User<AvailabilityStatus extends AvailabilityStatusType> {
  /**
   * Unique identifier for the User.
   */
  id: number;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * Full name of the User.
   */
  name: string;
  /**
   * Email of the User.
   */
  email: string;
  /**
   * Timestamp when the User was created, in UTC.
   */
  created_at: string;
  /**
   * Current availability status of the User, based on their working hours.
   */
  available: boolean;
  /**
   *  Current working status of the User.
   */
  availability_status: AvailabilityStatus;
  /**
   * Current substatus of the User.
   * If user selects availability_status as available or custom (available according to working hours or timezone) then substatus will be always_open.
   * If user selects availability_status as unavailable and doesn't select a substatus or unavailability reason in Phone App then it will be always_closed.
   * If user selects availability_status as unavailable and selects a substatus or unavailability reason in Phone App i.e. Out for lunch, On a break, In training, Back office or Other. The substatus will contain the exact substauts or unavailability reason selected.
   */
  substatus: AvailabilityStatusSubstatusMap[AvailabilityStatus];
  /**
   * List of Numbers associated to this User.
   */
  numbers: Array<Number<boolean>>;
  /**
   * The User's timezone. This can be set either from the Dashboard or the Phone (check our Knowledge Base : https://help.aircall.io/en/articles/3819481).
   * Default is Etc/UTC. More details on Timezones here : https://developer.aircall.io/api-references/#timezones.
   */
  time_zone: string;
  /**
   * The User's preferred language. This can be set either from the Dashboard or the Phone (check our Knowledge Base: https://help.aircall.io/en/articles/4108318-updating-your-language-settings-in-the-aircall-phone).
   * The format is IETF language tag (https://tools.ietf.org/html/bcp47). Default is en-US.
   */
  language: string;
  /**
   * A pre-set timer triggered after a call has ended, during which the user can’t receive any calls. Learn more: https://help.aircall.io/en/articles/3819534-setting-up-your-wrap-up-time.
   */
  wrap_up_time: number;
}

interface PhoneNumber {
  /**
   * Unique identifier for this phone number.
   */
  id: number;
  /**
   * A custom label like work, home...
   */
  label: string;
  /**
   * The raw phone number.
   * The value needs to be valid
   */
  value: string;
}

interface Email {
  /**
   * Unique identifier for this email address.
   */
  id: number;
  /**
   * A custom label like work, home...
   */
  label: string;
  /**
   * The email address.
   */
  value: string;
}

interface Contact {
  /**
   * Unique identifier for the Contact.
   */
  id: number;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * Contact's first name.
   */
  first_name: string;
  /**
   * Contact's last name.
   */
  last_name: string;
  /**
   * Contact's company name.
   */
  company_name: string;
  /**
   * Field used by Aircall to qualify tags.
   */
  description: string;
  /**
   * Extra information about the contact.
   * Can be used to store outside data.
   */
  information: string;
  /**
   * Contact can be shared within the organization.
   * All Contacts retrieved via the Public API are shared.
   */
  is_shared: boolean;
  /**
   * Phone numbers of this contact.
   */
  phone_numbers: Array<PhoneNumber>;
  /**
   * Email addresses of this contact.
   */
  emails: Array<Email>;
}

interface Team {
  /**
   * Unique identifier for the Team.
   */
  id: number;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * Full name of the Team.
   * name must be unique in a company and the length of the string should 64 characters maximum.
   */
  name: string;
  /**
   * Timestamp when the Team was created, in UTC.
   */
  created_at: string;
  /**
   * List of Users associated to this Team.
   */
  users: Array<Omit<User<AvailabilityStatusType>, 'available' | 'availability_status'>>;
}

interface Note {
  /**
   * Unique identifier for the Comment.
   */
  id: number;
  /**
   * Content of the Comment, written by Agent or via Public API.
   */
  content: string;
  /**
   * Timestamp of when the Comment was created.
   */
  posted_at: string;
  /**
   * User object who created the Comment.
   * Will be null if Comment is posted via Public API.
   */
  posted_by: User<AvailabilityStatusType> | null;
}

interface Tag {
  /**
   * Unique identifier for the Tag.
   */
  id: number;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * Tag's name.
   */
  name: string;
  /**
   * The color that this tag is displayed in.
   * In Hexadecimal format (https://en.wikipedia.org/wiki/Web_colors#Hex_triplet).
   */
  color: string;
  /**
   * Field used by Aircall to qualify Tags.
   */
  description: string;
}

interface ContactCallParticipant {
  /**
   * Either Contact or User id. Not present for external
   */
  id: string;
  /**
   * Participant's full name. Not present for external
   */
  name: string;
  /**
   * Not present in a user type participant
   */
  phone_number: string;
}

type CallParticipantType = 'user' | 'contact' | 'external';

type UserCallParticipant = Omit<ContactCallParticipant, 'phone_number'>;

type ExternalCallParticipant = Pick<ContactCallParticipant, 'phone_number'>;

type CallParticipant<Type extends CallParticipantType> = {
  /**
   * It will be 'user', 'contact' or 'external'
   */
  type: Type;
} & (Type extends 'user' ? UserCallParticipant : Type extends 'contact' ? ContactCallParticipant : Type extends 'external' ? ExternalCallParticipant : null);

// interface IvrOption {
//     /**
//      * Id of the ivr option selected
//      */
//     id: string;
//     /**
//      * Title of the ivr option selected
//      */
//     title: string;
//     /**
//      * Key/Digits pressed by the caller in ivr widget
//      * If No or Wrong/Invalid Input is selected by customer, then Key value will be fallback
//      */
//     key: string | 'fallback';
//     /**
//      * The branch name configured in the call distribution
//      */
//     branch: string;
//     /**
//      * Timestamp when the IVR option is selected
//      */
//     created_at: string;
//     /**
//      * Timestamp when the IVR option starts i.e. user starts listening to IVR Options.
//      */
//     transition_started_at: string;
//     /**
//      * Timestamp when the IVR option ends i.e. user selects an option or default option is selected.
//      */
//     transition_ended_at: string;
// }

interface Call {
  /**
   * Unique identifier for the Call.
   * Please note, Call id Data Type is Int64
   */
  id: number;
  /**
   * Call identifier from call provider
   * Please note sid attribute refers to call_uuid and has same value as call_uuid. sid is only available in Call APIs.
   */
  // sid: string;
  /**
   * Call identifier from call provider
   * Please note call_uuid attribute refers to sid and has same value as sid. call_uuid is only available in Call Webhook events
   */
  call_uuid: string;
  /**
   * Direct API URL.
   */
  direct_link: string;
  /**
   * UNIX timestamp when the Call started, in UTC.
   */
  started_at: number;
  /**
   * UNIX timestamp when the Call has been answered, in UTC.
   */
  answered_at: number;
  /**
   * UNIX timestamp when the Call ended, in UTC.
   */
  ended_at: number;
  /**
   * Duration of the Call in seconds.
   * This field is computed by ended_at - started_at.
   */
  duration: number;
  /**
   * Current status of the Call.
   * Can be initial, answered or done.
   */
  status: 'initial' | 'answered' | 'done';
  /**
   * Direction of the Call.
   * Could be inbound or outbound.
   */
  direction: 'inbound' | 'outbound';
  /**
   * International format of the number of the caller or the callee. For an anonymous call, the value is anonymous.
   */
  raw_digits: string | 'anonymous';
  /**
   * If present, a secured webpage containing the voicemail or live recording for this Call.
   * URL format is https://assets.aircall.io/[recording,voicemail]/:call_id.
   */
  asset?: string;
  /**
   * If present, the direct URL of the live recording (mp3 file) for this Call. This feature can be enabled from the Aircall Dashboard, on each Number - more information in our Knowledge Base (https://help.aircall.io/en/articles/5658190).
   * This link is valid for 1 hour only.
   */
  recording?: string;
  /**
   * When recording is present, a unique short URL redirecting to it.
   * This link is valid for 3 hours only.
   * URL format is https://short-urls.aircall.io/v1/:uuid.
   */
  recording_short_url?: string;
  /**
   * Only present if a voicemail was left. Voicemails can only be left by callers on inbound calls. If present, the direct URL of a voicemail (mp3 file) for this Call.
   * This link is valid for 1 hour only.
   */
  voicemail?: string;
  /**
   * When voicemail is present, a unique short URL redirecting to it.
   * This link is valid for 3 hours only.
   * URL format is https://short-urls.aircall.io/v1/:uuid.
   */
  voicemail_short_url?: string;
  /**
   * Describe if Call needs follow up.
   */
  archived: boolean;
  /**
   * Representing the reason why the Call was missed.
   * Can be out_of_opening_hours, short_abandoned, abandoned_in_ivr, abandoned_in_classic, no_available_agent or agents_did_not_answer.
   */
  missed_call_reason?:
    | 'out_of_opening_hours'
    | 'short_abandoned'
    | 'abandoned_in_ivr'
    | 'abandoned_in_classic'
    | 'no_available_agent'
    | 'agents_did_not_answer';
  /**
   * Cost of the Call in U.S. cents.
   * Cost is a legacy field which has been deprecated, we might reintroduce it in the future. For more info please reach out to us on support.aircall.io (mailto:support.aircall.io).
   */
  cost: string;
  /**
   * Full Number object attached to the Call.
   */
  number: Number<boolean>;
  /**
   * Full User object who took or made the Call.
   */
  user: User<AvailabilityStatusType>;
  /**
   * Full Contact object attached to the Call.
   */
  contact: Contact;
  /**
   * Full User object assigned to the Call.
   */
  assigned_to: User<AvailabilityStatusType>;
  /**
   * Full Teams object assigned to the Call.
   */
  teams: Array<Team>;
  /**
   * User who performed the Call transfer.
   */
  transfered_by: User<AvailabilityStatusType>;
  /**
   * User to whom the Call was transferred to.
   * If Call is transferred to a Team, this field will represent the first User of the Team.
   */
  transfered_to: User<AvailabilityStatusType>;
  /**
   * Notes added to this Call by Users.
   */
  comments: Array<Note>;
  /**
   * Tags added to this Call by Users.
   */
  tags: Array<Tag>;
  /**
   * Participants involved in a conference call.
   * Please note participants attribute is referred as conference_participants in Call APIs and as participants in call Webhook events
   */
  participants: Array<CallParticipant<CallParticipantType>>;
  /**
   * IVR options selected in a smartflow enabled number.
   * ivr_options_selected is retrievable via Call APIs using fetch timeline query param
   */
  // ivr_options_selected: Array<IvrOption>;
}

type ResourceDataMap = {
  number: Number<boolean>;
  user: User<AvailabilityStatusType>;
  contact: Contact;
  call: Call;
};

interface AircallWebhookResponseDto<Resource extends ResourceType> {
  /**
   * Name of the resource for this event.
   */
  resource: Resource;
  /**
   * Event's name for this payload.
   */
  event: ResourceEventMap[Resource];
  /**
   * UNIX timestamp for when the payload was built, in UTC.
   */
  timestamp: number;
  /**
   * Token associated to the Webhook. Use it to identify from which Aircall account a Webhook event is sent from.
   */
  token: string;
  /**
   * Modelization of the resource at the timestamp value.
   */
  data: ResourceDataMap[Resource];
}

export default AircallWebhookResponseDto;
