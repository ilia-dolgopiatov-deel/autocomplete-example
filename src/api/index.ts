export type Country = {
  id: string;
  name: string;
};

let COUNTRIES_LIST: Country[];

const fetchCountries = async () => {
  if (COUNTRIES_LIST?.length > 0) return COUNTRIES_LIST;
  const resp = await fetch(
    'https://62ed279a818ab252b60b27c6.mockapi.io/api/autocomplete/countries'
  );
  try {
    // mock api may return duplicated values, so have to rid of them
    const distinctCountries = new Set();
    const response: Country[] = await resp.json();
    COUNTRIES_LIST = response.filter(({ name }) => {
      if (distinctCountries.has(name)) {
        return false;
      }
      distinctCountries.add(name);
      return true;
    });
    return COUNTRIES_LIST;
  } catch {
    return [];
  }
};

export const fetchCountriesSugegstions = async (text: string) => {
  // mock api will return same values, so we emulate request for autocomplete and just filter the values
  // note that it's not ACTUALLY all countries, it's just all we have in the mock api
  const allCountries = await fetchCountries();
  return filterValues(allCountries, text);
};

const filterValues = (values: Country[], search: string) => {
  const searchLowerCase = search.toLowerCase();
  const startsWithValues = values.filter(({ name }) =>
    name.toLowerCase().startsWith(searchLowerCase)
  );
  const includesValues = values.filter(
    ({ name }) => name.toLowerCase().indexOf(searchLowerCase) >= 0
  );

  // prioritize items wich starts with search value
  return Array.from(
    new Set([...startsWithValues, ...includesValues])
  ) as Country[];
};
