import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const apiKey = '41588863-34d6c5c01e7f0c7c667666520';

const searchInput = document.querySelector('#search-input');
const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('.loader');
const form = document.querySelector('#search-form');
const lightbox = new SimpleLightbox('#image-container a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const loadMoreButton = document.querySelector('.load-more-btn');
const state = {
  currentPage: 1,
  totalHits: 0,
  query: '',
};

let cardHeight;

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onClickLoadBtn);

function onFormSubmit(event) {
  event.preventDefault();
  state.query = searchInput.value.trim();

  if (!state.query) {
    clearImages();
    hideLoadMoreButton();
    return;
  }

  loader.style.display = 'block';
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${state.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${state.currentPage}&per_page=40`;

  axios
    .get(apiUrl)
    .then(response => {
      const data = response.data;

      loader.style.display = 'none';
      if (Array.isArray(data.hits) && data.hits.length > 0) {
        state.totalHits = data.totalHits;
        renderImages(data.hits);
        lightbox.refresh();
        searchInput.value = '';
        setTimeout(() => {
          showLoadMoreButton();
        }, 0);
        state.currentPage++;
      } else {
        clearImages();
        hideLoadMoreButton();
        if (state.totalHits === 0) {
          iziToast.show({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            messageColor: 'white',
            backgroundColor: 'red',
            position: 'topRight',
          });
        } else {
          iziToast.show({
            message:
              "We're sorry, but you've reached the end of search results.",
            messageColor: 'white',
            backgroundColor: 'orange',
            position: 'topRight',
          });
          searchInput.value = '';
          state.currentPage = 1;
        }
      }
    })
    .catch(error => {
      loader.style.display = 'none';
      console.error('Error!', error);
    });
}

function renderImages(images) {
  images.map(image => {
    const imageCard = `
      <div class="image-card">
        <a href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}">
          <div class="image-info">
            <p><strong>Likes:</strong> ${image.likes}</p>
            <p><strong>Views:</strong> ${image.views}</p>
            <p><strong>Comments:</strong> ${image.comments}</p>
            <p><strong>Downloads:</strong> ${image.downloads}</p>
          </div>
        </a>
      </div>
    `;
    imageContainer.innerHTML += imageCard;
  });
  const firstImageCard = document.querySelector('.image-card');
  if (firstImageCard) {
    cardHeight = firstImageCard.getBoundingClientRect().height;
  }
}

function clearImages() {
  imageContainer.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function onClickLoadBtn() {
  state.query = searchInput.value.trim();

  if (state.currentPage <= Math.ceil(state.totalHits / 40)) {
    loader.style.display = 'block';
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${state.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${state.currentPage}&per_page=40`;

    axios
      .get(apiUrl)
      .then(response => {
        const data = response.data;

        loader.style.display = 'none';

        if (Array.isArray(data.hits) && data.hits.length > 0) {
          renderImages(data.hits);
          lightbox.refresh();
          state.currentPage++;
          const firstImageCard = document.querySelector('.image-card');
          if (firstImageCard) {
            cardHeight = firstImageCard.getBoundingClientRect().height;
            scrollCards(cardHeight * 2);
          }

          setTimeout(() => {
            showLoadMoreButton();
          }, 0);
        }
      })
      .catch(error => {
        loader.style.display = 'none';
        console.error('Error!', error);
      });
  } else {
    hideLoadMoreButton();
    iziToast.show({
      message: `We're sorry, but you've reached the end of search results.`,
      messageColor: 'white',
      backgroundColor: 'orange',
      position: 'topRight',
    });
  }
}

function scrollCards(height) {
  const firstImageCard = document.querySelector('.image-card');
  if (firstImageCard) {
    window.scrollBy({
      top: height,
      left: 0,
      behavior: 'smooth',
    });
  }
}
