export const PUBLIC_BASE_URL = import.meta.env.PROD ? 'https://open-services-vizion.vizeo.eu/' : 'https://open-services-vizion-test.vizeo.eu/';
export const PRIVATE_BASE_URL = import.meta.env.PROD ? 'https://services-vizion.vizeo.eu' : 'https://services-vizion-test.vizeo.eu';
export const AUTH_BASE_URL = `${import.meta.env.PROD ? 'https://auth-vizion.vizeo.eu' : 'https://auth-vizeo-test.vizeo.eu'}/auth/realms/vizion-realm/protocol/openid-connect`;

export const AUTH_CLIENT = 'vizion-auth-client';
export const AUTH_SECRET = '6530e11e-090f-44a6-b4f0-55f71329ef44';
