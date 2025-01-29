import ProfileInfoResponseDto from '../types/ProfileInfoResponseDto';

export const generateUserEmailSignature = (user: ProfileInfoResponseDto) => {
  return (
    '<br /><br />Cordialement,<br /><br />' +
    `${user.profile.firstName ?? ''} ${user.profile.lastName ?? ''}<br />` +
    `${user.profile.email ?? ''}<br />04 72 12 27 96<br />` +
    'https://www.vizeo.eu'
  );
};
