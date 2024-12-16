declare module 'aircall-everywhere' {
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
      domToLoadPhone: string;
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

    /**
     * Listening to incoming_call: there is an incoming call, ringing
     */
    on: (event: 'incoming_call', callback: (callInfos: { from: string; to: string; call_id: number }) => void) => void;
    /**
     * Listening to call_end_ringtone: the ringtone has ended. This event is only triggered for incoming calls.
     */
    on: (event: 'call_end_ringtone', callback: (callInfos: { answer_status: 'answered | disconnected | refused'; call_id: number }) => void) => void;
    /**
     * Listening to outgoing_call: an outgoing call has started
     */
    on: (event: 'outgoing_call', callback: (callInfos: { from: string; to: string; call_id: number }) => void) => void;
    /**
     * Listening to outgoing_answered: an outgoing call has been answered
     */
    on: (event: 'outgoing_answered', callback: (callInfos: { call_id: number }) => void) => void;
    /**
     * Listening to call_ended: a call has been ended
     */
    on: (event: 'call_ended', callback: (callInfos: { duration: number; call_id: number }) => void) => void;
    /**
     * Listening to comment_saved: a comment has been saved about a call
     */
    on: (event: 'comment_saved', callback: (commentInfos: { comment: string; call_id: number }) => void) => void;
    /**
     * Listening to external_dial: a dial has been made from outside of the phone (api/extension)
     */
    on: (event: 'external_dial', callback: (callInfos: { phone_number: string }) => void) => void;
    /**
     * Listening to powerdialer_updated: a powerdialer campaign has been updated (via extension)
     */
    on: (event: 'powerdialer_updated', callback: () => void) => void;
    /**
     * Listening to redirect_event: event coming from specific CRM settings if it has been enabled in the Aircall Dashboard. Only zendesk and hubspot is supported for now.
     */
    on: (event: 'redirect_event', callback: (redirectInfos: { type: 'Zendesk::User' | 'Zendesk::Ticket'; id: number }) => void) => void;

    /**
     * You can remove a listener added by on with this method.
     * @param event event to stop listening to
     */
    removeListener(
      event:
        | 'incoming_call'
        | 'call_end_ringtone'
        | 'outgoing_call'
        | 'outgoing_answered'
        | 'call_ended'
        | 'comment_saved'
        | 'external_dial'
        | 'powerdialer_updated'
        | 'redirect_event',
    ): void;
  }
}
