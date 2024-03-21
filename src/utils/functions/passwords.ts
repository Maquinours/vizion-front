export const checkPassword = (password: string | null | undefined) => {
  if (!password) return { isValid: false, validationRules: { length: false, upper: false, lower: false, special: false, number: false } };
  const validationRules = {
    length: /^.*(?=.{8,}).*$/.test(password),
    upper: /^(?=.*?[A-Z])/.test(password),
    lower: /^(?=.*?[a-z])/.test(password),
    special: /^(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/.test(password),
    number: /^(?=.*?[0-9])/.test(password),
  };

  return { isValid: Object.values(validationRules).every((rule) => rule), validationRules };
};

export const generatePassword = () => {
  const charset = '!@#$%^&*()0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let newPassword: string;
  do {
    newPassword = '';
    for (let i = 0; i < 13; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  } while (!checkPassword(newPassword).isValid);

  return newPassword;
};
