import isoCountries from 'i18n-iso-countries';
import frLocale from 'i18n-iso-countries/langs/fr.json';

isoCountries.registerLocale(frLocale);

const countries = Object.entries(isoCountries.getNames('fr', { select: 'official' })).map(([code, name]) => ({ code, name }));

export default countries;
