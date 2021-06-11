import cardImgTMPL from '../templates/photoCardMarkup.hbs';
import ApiService from './apiService';
import loadMoreBtn from './loadMoreBtn';
import createModal from './modal';
import {
    alertNoMoreImages,
    alertLastImages,
    alertSeachPerformed,
    alertBadQuery,
} from './pnotify';

const imgCardRef = document.querySelector('.gallery');
const searchFormRef = document.querySelector('#search-form');
const loadMoreBtnRef = document.querySelector('[data-action="load-more"]');
const bottomElement = document.querySelector('.bottom-element');

const API = new ApiService();

searchFormRef.addEventListener('submit', hendlerInput);
loadMoreBtnRef.addEventListener('click', getFetchData);
imgCardRef.addEventListener('click', handleOpenModal);


function hendlerInput(e) {
    e.preventDefault();
    API.resetPage();
    API.query = e.currentTarget.query.value.trim();
    API.selectData = e.currentTarget.select.value;
    clearInput();
    API.searchQuery ? getFetchData() : alertBadQuery();
}

function getFetchData() {
    loadMoreBtn.disable();
    API.fetchContent().then(img => {
        renderingImgCard(img);
    })
        .catch(alertSeachPerformed())
}

function renderingImgCard(hits) {
    if (hits.length !== 0) {
        imgCardRef.insertAdjacentHTML('beforeend', cardImgTMPL(hits));
        loadMoreBtn.show();
        loadMoreBtn.enable();

        if (hits.length < 12) {
            alertLastImages();
            loadMoreBtn.hide();
        }

        if (API.currentPage > 2) {
            toBottom();
        }
    } else {
        alertNoMoreImages()
    }
}

function clearInput() {
    searchFormRef.query.value = '';
    imgCardRef.innerHTML = '';
}

function handleOpenModal(event) {
    if (event.target.nodeName !== 'IMG') {
        return;
    }
    const largeImageURL = event.target.dataset.source;
    createModal(largeImageURL);
}

function toBottom() {
    bottomElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    });
}
