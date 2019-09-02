import countries from 'world-countries';
import flags from '../src/countryFlags';
import extraCountries from '../src/extra-countries';

const isEmoji = process.argv.includes('--emoji');
const isCca2 = process.argv.includes('--cca2');

const getCountryNames = (common, translations) =>
  Object.keys(translations)
    .map(key => ({ [key]: translations[key].common }))
    .reduce(
      (prev, cur) => ({
        ...prev,
        [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]]
      }),
      {}
    );

const newcountries = countries
  .map(({ cca2, cca3, currency, callingCode, name: { common }, translations }) => ({
    [cca2]: {
      cca3,
      currency: currency[0],
      callingCode: callingCode[0],
      flag: isEmoji ? `flag-${cca2.toLowerCase()}` : flags[cca2],
      name: { common, ...getCountryNames(common, translations) }
    }
  }))
  .concat(
    extraCountries.map(country => {
      const { cca2, flagImage, ...countryRest } = country;
      return isEmoji ? { [cca2]: countryRest } : { [cca2]: { ...countryRest, flag: flagImage } };
    })
  )
  .sort((a, b) => a[Object.keys(a)[0]].name.common > b[Object.keys(b)[0]].name.common)
  .reduce(
    (prev, cur) => ({
      ...prev,
      [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]]
    }),
    {}
  );

if (!isCca2) {
  console.log(JSON.stringify(newcountries)); // eslint-disable-line
} else {
  console.log(JSON.stringify(Object.keys(newcountries))); // eslint-disable-line
}
