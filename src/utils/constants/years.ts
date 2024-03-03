const firstYear = new Date('2015').getFullYear();
const currentYear = new Date().getFullYear();

const YEARS = Array.from({ length: currentYear - firstYear + 1 }, (_, index) => firstYear + index);

export default YEARS;
