import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
export const ERROR_MSG = 'Oops, there is no country with that name';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countyList: document.querySelector('.country-list'),
  infoBlock: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch(e) {
  const query = e.target.value.trim();

  if (query === '') {
    deleteMarkup(refs.infoBlock);
    deleteMarkup(refs.countyList);
    return;
  }

  fetchCountries(query)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.', {
          clickToClose: true,
        });
        return;
      }

      renderMarkup(data);
    })
    .catch(error => {
      deleteMarkup(refs.infoBlock);
      deleteMarkup(refs.countyList);
      console.log(error);
    });
}

function renderMarkup(matches) {
  if (matches.length > 1) {
    refs.countyList.innerHTML = makeSearchPreviewMarkup(matches);
    deleteMarkup(refs.infoBlock);
  } else {
    refs.infoBlock.innerHTML = makeInfoBlockMarkup(matches);
    deleteMarkup(refs.countyList);
  }
}

function makeSearchPreviewMarkup(matches) {
  return matches
    .map(
      ({ flags, name }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="60" height="40"> ${name.official}</li>`,
    )
    .join('');
}

function makeInfoBlockMarkup(matches) {
  return matches
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.svg}" alt="${name.official}" width="110px" height="80px"/>${
          name.official
        }</h1>
        <ul>
          <li>Capital: ${capital}</li>
          <li>Population: ${population}</li>
          <li>Languages: ${Object.values(languages)}</li>
        </ul>`,
    )
    .join('');
}

function deleteMarkup(element) {
  element.innerHTML = '';
}
