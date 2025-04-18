import { toBase64 } from 'js-base64';

export const PUBLIC_BASE_URL = 'https://open-services-vizion.vizeo.eu/';
export const PRIVATE_BASE_URL = 'https://test-services-vizion.vizeo.eu';
export const AUTH_BASE_URL = 'https://auth-vizion.vizeo.eu/auth/realms/vizion-realm/protocol/openid-connect';
export const FILE_STORAGE_BASE_URL = 'https://storage-vizion.vizeo.eu/api/uploads';
export const FILE_READ_STORAGE_BASE_URL = 'https://storage-vizion.vizeo.eu/uploads';
export const WEBSOCKET_URL = 'https://notifications.vizeo.eu/ws-notification/';
export const CHAT_WEBSOCKET_URL = 'wss://vizion-chat-socket.vizeo.eu:443';
export const AIRCALL_WEBSOCKET_URL = 'wss://vizion-aircall-socket.vizeo.eu:443';

export const AUTH_CLIENT = 'vizion-auth-client';
export const AUTH_SECRET = '6530e11e-090f-44a6-b4f0-55f71329ef44';

export const AIRCALL_API_URL = 'https://api.aircall.io/v1';
const AIRCALL_API_ID = '72c97b58603af07b9e590c8732ca112d';
const AIRCALL_API_TOKEN = 'c3fd0fcb44337bba75a15c7e44e80188';
export const AIRCALL_AUTHORIZATION = toBase64(`${AIRCALL_API_ID}:${AIRCALL_API_TOKEN}`);
 