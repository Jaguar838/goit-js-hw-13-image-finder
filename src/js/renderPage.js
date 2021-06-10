import cardImgTMPL from '../templates/photoCardMarkup.hbs';
import ApiService from './apiService';
import loadMoreBtn from './loadMoreBtn';
import createModal from './modal';
import {
    alertNoMoreImages,
    alertLastImages,
    alertSeachPerformed,
    alertUnforseenError,
    alertBadQuery,
  } from './pnotify';

const imgCardRef = document.querySelector('.gallery');
const searchFormRef = document.querySelector('#search-form');
const headerFormRef = document.querySelector('.search-form__header');
const loadMoreBtnRef = document.querySelector('[data-action="load-more"]');
const bottomElement = document.querySelector('.bottom-element');
const API = new ApiService();

searchFormRef.addEventListener('submit', hendlerInput);
loadMoreBtnRef.addEventListener('click', getFetchData);
imgCardRef.addEventListener('click', handleOpenModal);


function hendlerInput(e){    
        e.preventDefault();                
        API.resetPage();
        API.query = e.currentTarget.query.value.trim();  
        API.selectData = e.currentTarget.select.value;
        clearInput();  
        API.searchQuery ? getFetchData() : alertBadQuery();
}

function getFetchData(){ 
    loadMoreBtn.disable();
    API.fetchContent().then(img => {
        renderingImgCard(img); 
    })
    .catch(error404)    
}

function renderingImgCard(hits){ 
    if(hits.length !== 0) {
        imgCardRef.insertAdjacentHTML('beforeend', cardImgTMPL(hits));
        loadMoreBtn.show();                
        loadMoreBtn.enable();

        if(hits.length < 12) {
            headerFormRef.innerHTML = 'There are no more images in this category. Choose another search term';
            loadMoreBtn.hide(); 
        }

        if(API.currentPage > 2) {
            toBottom();
        }                 
    } else{               
        alertNoMoreImages()
    }
}

function error404(){ 
    clearInput();     
    loadMoreBtn.hide();  
    headerFormRef.innerHTML = 'Specify the request more correctly';
    headerFormRef.classList.add('red');
}

function clearInput() {  
    searchFormRef.query.value = '';   
    headerFormRef.innerHTML = ''; 
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
    console.log(bottomElement);
    bottomElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
