import cardImgTMPL from '../templates/photoCardMarkup.hbs';
import debounce from 'lodash.debounce';

import error from './pnotify';
import loadMoreBtn from './load-more-btn';


const imgCardRef = document.querySelector('.gallery');
const searchFormRef = document.querySelector('#search-form');
const headerFormRef = document.querySelector('.search-form__header');
const loadMoreBtnRef = document.querySelector('[data-action="load-more"]');


searchFormRef.addEventListener('submit', hendlerInput);
loadMoreBtnRef.addEventListener('click', getFetchData);
imgCardRef.addEventListener('click', handleOpenModal);


refs.input.addEventListener(
  'input',
  debounce(handleGenerateListFromResponse, 1000),
);

// Забираем значение с инпута 
function handleGenerateListFromResponse(event) {
  let inputValue = event.target.value.trim();
  clearContent();
  if (!inputValue) {
    error404();
    return;
  }

  getCountriesList(inputValue)
}

// Создаем разметку страны по шаблону hbs
function addFullCoutryInfo(country) {
  const markup = countriesMarkupTMPT(country);

  //   Добавляем новую разметку страны
  refs.countryContainer.insertAdjacentHTML('beforeend', markup);
}

function clearContent() {
  refs.inputMessage.innerHTML = '';
  refs.inputList.innerHTML = '';
  refs.countryContainer.innerHTML = '';
}

// Выводим значение в зависимости от полученого к-ва стран
function selectTypeOutputInfo(numberOfCountries) {
  console.log(numberOfCountries);

  if (numberOfCountries.length < 2) {
    addFullCoutryInfo(numberOfCountries);
  }

  if (numberOfCountries.length >= 2 && numberOfCountries.length <= 10) {
    numberOfCountries.forEach(country => {
      refs.inputList.insertAdjacentHTML('beforeend', `<li>${country.name}</li>`)
    });

    refs.inputList.addEventListener('click', e => {
      clearContent();
      const getInputValue = refs.input.value = e.target.textContent;
      const country = numberOfCountries.find(country => {
        return country.name === getInputValue
      })
      addFullCoutryInfo({ country });
    })
  }

  if (numberOfCountries.length > 10) {
    const message = 'Найдено слишком много совпадений, уточните ваш запрос'
    refs.inputMessage.insertAdjacentHTML('beforeend', message);
    error({
      title: 'Ошибка',
      text: message,
      delay: 2000,
    });
  }
}

function getCountriesList(value) {
  fetchCountries(value)
    .then(countries => selectTypeOutputInfo(countries))
    .catch(error => error404(error));
}



function renderingImgCard(hits) {
  if (hits.length !== 0) {
    imgCardRef.insertAdjacentHTML('beforeend', cardImgTMPL(hits));
    loadMoreBtn.show();
    loadMoreBtn.enable();

    if (hits.length < 12) {
      headerFormRef.innerHTML = 'There are no more images in this category. Choose another search term';
      loadMoreBtn.hide();
    }

    if (apiService.page > 2) {
      window.scrollTo({
        top: document.documentElement.offsetHeight - 100,
      });
    }
  } else {
    error404()
  }
}

function error404(err) {
  const message = 'Не корректный запрос. Повторите попытку еще раз'
  refs.inputMessage.insertAdjacentHTML('beforeend', message);
}
// function error404() {
//   clearInput();
//   loadMoreBtn.hide();
//   headerFormRef.innerHTML = 'Specify the request more correctly';
//   headerFormRef.classList.add('red');
// }

function clearInput() {
  searchFormRef.query.value = '';
  headerFormRef.innerHTML = '';
  imgCardRef.innerHTML = '';
}
