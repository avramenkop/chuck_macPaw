let radioInputs = document.querySelectorAll('.radio__input');
let randomInput = document.querySelector('#random');
let categoriesInput = document.querySelector('#categories');
let searchInput = document.querySelector('#search');
let categoriesWrapper = document.querySelector('.get-joke__sub-item.sub-1');
let searchWrapper = document.querySelector('.get-joke__sub-item.sub-2');
let getJokeBtn = document.querySelector('.get-joke__btn');
let burgerButton = document.querySelector('.burger-icon-wrapper');
let backdrop = document.querySelector('.backdrop');
let mobileFav = document.querySelector('.mobile-fav');
let clientWidth = document.body.clientWidth;
let fav = [];


// display fav jokes if localStorage isn't empty
if (localStorage.getItem('fav') !== null) {
  let displayJoke = new DisplayJoke();
  let jokes = JSON.parse(localStorage.getItem('fav'));

  jokes.map(joke => {
    if(joke.categories.length !== 0) {
      displayJoke.displayJoke(joke, 'fav-btn', 'joke__category');
      displayJoke.addFavJoke(joke);
    } else {
      displayJoke.displayJoke(joke, 'fav-btn');
      displayJoke.addFavJoke(joke);
    }
  });
}


// display/hide additional search options if parent input checked
const inputsHandler = () => {
  if (randomInput.checked) {
    categoriesWrapper.style.display = 'none';
    searchWrapper.style.display = 'none';
  } else if (categoriesInput.checked) {
    categoriesWrapper.style.display = 'flex';
    searchWrapper.style.display = 'none';
  } else if (searchInput.checked) {
    categoriesWrapper.style.display = 'none';
    searchWrapper.style.display = 'block';
  }
};

for (let i = 0; i < radioInputs.length; i++) {
  radioInputs[i].oninput = inputsHandler;
}


// get joke
getJokeBtn.addEventListener('click', () => {

  if (randomInput.checked) {
    let randomJoke = new Joke();
    let displayJoke = new DisplayJoke();

    randomJoke.getRandomJoke().then(data => {
      if(data.categories.length !== 0) {
        displayJoke.displayJoke(data, 'add-to-fav', 'joke__category');
        Storage.saveJoke(data);
      } else {
        displayJoke.displayJoke(data, 'add-to-fav');
        Storage.saveJoke(data);
      }
    }).then(() => {
      displayJoke.getFavButtons();
    });

  } else if (categoriesInput.checked) {
    let categoryJoke = new Joke();
    let displayJoke = new DisplayJoke();

    categoryJoke.getCategoryJoke().then(data => {
      if(data.categories.length !== 0) {
        displayJoke.displayJoke(data, 'add-to-fav', 'joke__category');
        Storage.saveJoke(data);
      } else {
        displayJoke.displayJoke(data, 'add-to-fav');
        Storage.saveJoke(data);
      }
    }).then(() => {
      displayJoke.getFavButtons();
    });

  } else if (searchInput.checked) {
    let searchJoke = new Joke();
    let displayJoke = new DisplayJoke();

    searchJoke.getSearchJoke().then(data => {
      if(data.categories.length !== 0) {
        displayJoke.displayJoke(data, 'add-to-fav', 'joke__category');
        Storage.saveJoke(data);
      } else {
        displayJoke.displayJoke(data, 'add-to-fav');
        Storage.saveJoke(data);
      }
    }).then(() => {
      displayJoke.getFavButtons();
    });
  }
});


// delete fav joke
document.addEventListener("click", (event) => {
  if (event.target.className === 'delete-fav') {
    let id = event.target.dataset.id;
    Storage.deleteFav(id);
  }
});


// display/hide mobile favs
const displayMobFavs = () => {
  burgerButton.classList.toggle('burger-icon-wrapper-active');
  backdrop.classList.toggle('backdrop-active');
  mobileFav.classList.toggle('mobile-fav-active');
};
burgerButton.onclick = displayMobFavs;


// hide backdrop if clicked outside burger button
backdrop.addEventListener('click', () => {
  if (backdrop.classList.contains('backdrop-active')) {
    backdrop.classList.toggle('backdrop-active');
    mobileFav.classList.toggle('mobile-fav-active');
    burgerButton.classList.toggle('burger-icon-wrapper-active');
  }
});


// hide backdrop and mobile favs if they don't closed, but content width increasing
window.addEventListener(`resize`, event => {
  if(backdrop.classList.contains('backdrop-active') && mobileFav.classList.contains('mobile-fav-active') && clientWidth > 1200) {
    burgerButton.classList.toggle('burger-icon-wrapper-active');
    backdrop.classList.toggle('backdrop-active');
    mobileFav.classList.toggle('mobile-fav-active');
  }
});























