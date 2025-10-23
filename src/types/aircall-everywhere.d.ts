declare module 'aircall-everywhere' {
  type EventType =
    | 'incoming_call'
    | 'call_end_ringtone'
    | 'outgoing_call'
    | 'outgoing_answered'
    | 'call_ended'
    | 'comment_saved'
    | 'external_dial'
    | 'powerdialer_updated'
    | 'redirect_event';

  interface IncomingCallInfo {
    from: string;
    to: string;
    call_id: number;
  }

  interface CallEndRingtoneInfo {
    answer_status: 'answered | disconnected | refused';
    call_id: number;
  }

  interface OutgoingCallInfo {
    from: string;
    to: string;
    call_id: number;
  }

  interface OutgoingAnsweredInfo {
    call_id: number;
  }

  interface CallEndedInfo {
    duration: number;
    call_id: number;
  }

  interface CommentSavedInfo {
    comment: string;
    call_id: number;
  }

  interface ExternalDialInfo {
    phone_number: string;
  }

  interface RedirectEventInfo {
    type: 'Zendesk::User' | 'Zendesk::Ticket';
    id: number;
  }

  type EventCallbackMap = {
    incoming_call: (callInfos: IncomingCallInfo) => void;
    call_end_ringtone: (callInfos: CallEndRingtoneInfo) => void;
    outgoing_call: (callInfos: OutgoingCallInfo) => void;
    outgoing_answered: (callInfos: OutgoingAnsweredInfo) => void;
    call_ended: (callInfos: CallEndedInfo) => void;
    comment_saved: (callInfos: CommentSavedInfo) => void;
    external_dial: (callInfos: ExternalDialInfo) => void;
    powerdialer_updated: () => void;
    redirect_event: (callInfos: RedirectEventInfo) => void;
  };

  export default class AircallPhone {
    constructor(options: {
      /**
       * Callback function after the phone is fully loaded, logged in, and the connexion between the phone and the CRM is established. This callback will triggers everytime the user logs again. User details and integration settings if any are passed as parameters.
       */
      onLogin: (settings: {
        user: {
          email: string;
          first_name: string;
          last_name: string;
          company_name: string;
        };
        settings: {
          [key: string]: unknown;
        };
      }) => void;
      /**
       * Callback function after the user logs out of the phone. It will triggers everytime the user logs out.
       */
      onLogout: () => void;
      /**
       * You can specify a CRM from which specific settings can be retrieved. Only zendesk or hubspot available for now. You can ignore this if you have your own CRM.
       */
      integrationToLoad?: 'zendesk' | 'hubspot';
      /**
       * You must specify in which element you want to load the phone. Query selector string.
       */
      domToLoadWorkspace: string;
      /**
       * You can specify a preset for the size of the phone loaded. 3 possibilities:
       * @example
       *    big: 666px by 376px. Recommanded and default value
       *    small: 600px by 376px
       *    auto: 100% width and height. Not recommanded
       */
      size?: 'big' | 'small' | 'auto';
      /**
       * Enables or disables logging. Defaults to true.
       */
      debug?: boolean;
    });

    isLoggedIn: (callback: (loggedIn: boolean) => void) => void;

    on<T extends EventType>(event: T, callback: EventCallbackMap[T]): void;

    /**
     * You can remove a listener added by on with this method.
     * @param event event to stop listening to
     */
    removeListener(event: EventType): void;

    send(event: 'dial_number', payload: { phone_number: string }, callback: (success: boolean, data: unknown) => void): void;
  }
}
