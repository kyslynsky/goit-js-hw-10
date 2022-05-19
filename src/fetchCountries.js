import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ERROR_MSG } from './index';

const BASE_URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name) {
  return fetch(`${BASE_URL}/${name}?fields=name,capital,population,flags,languages`).then(
    responce => {
      if (responce.ok) {
        return responce.json();
      }

      Notify.failure(`${ERROR_MSG}`, { clickToClose: true });
      throw new Error(responce.statusText);
    },
  );
}
