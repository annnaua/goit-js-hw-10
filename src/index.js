import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';

const refs = {
  searchCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';

// Cвойства, возвращаемые с бэкенда
const fields = 'name,capital,population,flags,languages';
// Notify
const notifyOptions = {
  timeout: 3000,
  pauseOnHover: true,
  clickToClose: true,
};

// Ответ

function responseCountries(data) {
  if (data.length >= 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.',
      notifyOptions
    );
    return;
  }

  if (data.length > 1 && data.length < 10) {
    renderCountryListMarkup(data);
    return;
  }

  renderCountryMarkup(data);
  console.log(data);
}

// Разметка

function renderCountryListMarkup(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="counries-item">
              <img class="counries-image" src="${svg}" alt="${official}">
              <h2 class="counries-name">${official}</h2> 
      </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function renderCountryMarkup(data) {
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = data[0];

  const markup = `<div>
                    <img class="country-image" src="${svg}" alt="${official}" />
                    <h1 class="country-name">${official}</h1>
                  </div>
                  <ul class="country">  
                    <li class="country__item"><span>Capital:</span> ${capital}</li>
                    <li class="country__item"><span>Population:</span> ${population}</li>
                    <li class="country__item"><span>Languages:</span> ${Object.values(
                      languages
                    )}</li>
                  </ul>`;

  refs.countryInfo.innerHTML = markup;
}

// Очистка

const clearCountry = () => {
  refs.countryList.innerHTML = '';
};
const clearCountryInfo = () => {
  refs.countryInfo.innerHTML = '';
};

function onSearch() {
  clearCountry();
  clearCountryInfo();
  const country = refs.searchCountry.value.trim();

  // 1. Если поле поиска пустое
  if (country.length === 0) {
    return;
  }

  // 2. В остальных случаях вызывать функцию
  fetchCountries(BASE_URL, country, fields)
    .then(responseCountries)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name', notifyOptions);
      console.log(error);
    });
}

// Ввод страны

refs.searchCountry.addEventListener(
  'input',
  debounce(onSearch, DEBOUNCE_DELAY)
);
