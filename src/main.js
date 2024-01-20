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
  currentQuery: '',
};

let cardHeight;

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onClickLoadBtn);

async function onFormSubmit(event) {
  event.preventDefault();
  state.currentPage = 1;
  clearImages();
  const newQuery = searchInput.value.trim();

  if (!newQuery) {
    hideLoadMoreButton();
    return;
  }

  loader.style.display = 'block';

  if (newQuery !== state.currentQuery) {
    state.currentQuery = newQuery;
  }

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${state.currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${state.currentPage}&per_page=40`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    loader.style.display = 'none';
    if (Array.isArray(data.hits) && data.hits.length > 0) {
      state.totalHits = data.totalHits;
      clearImages();
      if (state.currentPage < Math.ceil(state.totalHits / 40)) {
        showLoadMoreButton();
      }
      renderImages(data.hits);

      lightbox.refresh();
    } else {
      clearImages();
      hideLoadMoreButton();
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageColor: 'white',
        backgroundColor: 'red',
        position: 'topRight',
      });
      if (state.totalHits < 40) {
        hideLoadMoreButton();
      }
    }
  } catch (error) {
    loader.style.display = 'none';
    console.error('Error!', error);
  }
  state.query = state.currentQuery;
  searchInput.value = '';
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
    imageContainer.insertAdjacentHTML('beforeend', imageCard);
  });
}

function clearImages() {
  if (state.query !== state.currentQuery) {
    imageContainer.innerHTML = '';
  }
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

async function onClickLoadBtn() {
  state.query = state.currentQuery;

  loader.style.display = 'block';
  state.currentPage++;
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${state.currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${state.currentPage}&per_page=40`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    loader.style.display = 'none';

    if (Array.isArray(data.hits) && data.hits.length > 0) {
      renderImages(data.hits);
      lightbox.refresh();

      if (state.currentPage < Math.ceil(state.totalHits / 40)) {
        showLoadMoreButton();

        const firstImageCard = document.querySelector('.image-card');
        if (firstImageCard) {
          cardHeight = firstImageCard.getBoundingClientRect().height;
          scrollCards(cardHeight * 2);
        }
      } else {
        scrollCards(cardHeight * 2);
        hideLoadMoreButton();
        iziToast.show({
          message: `We're sorry, but you've reached the end of search results.`,
          messageColor: 'white',
          backgroundColor: 'orange',
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    loader.style.display = 'none';
    console.error('Error!', error);
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
