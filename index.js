let randomInput = document.querySelector('#random');
let categoriesInput = document.querySelector('#categories');
let availableCategories = document.querySelectorAll('.radio-inserted__input');
let searchInput = document.querySelector('#search');
let textInput = document.querySelector('.text-inserted__input');
let categoriesWrapper = document.querySelector('.get-joke__sub-item.sub-1');
let searchWrapper = document.querySelector('.get-joke__sub-item.sub-2');
let getJokeBtn = document.querySelector('.get-joke__btn');
let jokesDOM = document.querySelector('.jokes');
let favDOM = document.querySelector('.favourite__jokes');
let favDOMMobile = document.querySelector('.favourite__jokes-mobile');



let fav = [];

console.log(document.body.clientWidth);




// анаимация кнопки
const f1 = () => {
  document.querySelector('.burger-icon').classList.toggle('burger-icon-active');
  document.querySelector('.backdrop').classList.toggle('backdrop-active');
  document.querySelector('.mobile-fav').classList.toggle('mobile-fav-active');
};

document.querySelector('.burger-icon-wrapper').onclick = f1;


let backdrop = document.querySelector('.backdrop');
let mobile = document.querySelector('.mobile-fav');

backdrop.addEventListener('click', () => {

  if (backdrop.classList.contains('backdrop-active')) {
    backdrop.classList.toggle('backdrop-active');
    document.querySelector('.mobile-fav').classList.toggle('mobile-fav-active');
    document.querySelector('.burger-icon').classList.toggle('burger-icon-active');
  }

});


window.addEventListener(`resize`, event => {
  if(
    backdrop.classList.contains('backdrop-active') &&
    mobile.classList.contains('mobile-fav-active') &&
    document.body.clientWidth > 1200
  ) {
    document.querySelector('.burger-icon').classList.toggle('burger-icon-active');
    document.querySelector('.backdrop').classList.toggle('backdrop-active');
    document.querySelector('.mobile-fav').classList.toggle('mobile-fav-active');
  }
});




class ConvertTime {
  static convertTime(data) {
    const startDate = new Date(data.updated_at);
    const endDate = new Date(); // time now
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    const hours = seconds / (60 * 60);
    return hours
  }
}



class Joke {
  async getRandomJoke() {
    try {
      let response = await fetch('https://api.chucknorris.io/jokes/random');
      let data = await response.json();

      let updated_at = ConvertTime.convertTime(data).toFixed();

      const {id, value, categories} = data;
      return {id, value, updated_at, categories}
    } catch (error) {
      console.error(error);
    }
  }

  async getCategoryJoke() {
    for (let i = 0; i < availableCategories.length; i++) {
      if (availableCategories[i].checked) {
        try {
          let response = await fetch(`https://api.chucknorris.io/jokes/random?category=${availableCategories[i].value}`);
          let data = await response.json();

          let updated_at = ConvertTime.convertTime(data).toFixed();


          const {id, value, categories} = data;
          return {id, value, updated_at, categories}
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  async getSearchJoke() {
    if (textInput) {
      try {
        let response = await fetch(`https://api.chucknorris.io/jokes/search?query=${textInput.value}`);
        let data = await response.json();
        let randIndex = Math.floor(Math.random() * (data.result.length + 1));

        const updated_at = ConvertTime.convertTime(data.result[randIndex]).toFixed();
        const {id, value, categories} = data.result[randIndex];
        textInput.value = '';
        return {id, value, updated_at, categories}
      } catch (error) {
        console.error(error);
      }
    }
  }
}


class DisplayJoke {
  displayJoke(data, btnClass, catClass) {
    let joke = '';
    joke = `
            <div class="joke" id=${data.id}>
                <button class=${btnClass} data-id=${data.id}></button>
                <div class="joke__id">
                    ID: <a href="https://api.chucknorris.io/jokes/${data.id}">${data.id}</a><img src="img/link.png" alt="">
                </div>
                <div class="joke__text">
                    ${data.value}
                </div>
                <div class="joke__info">
                    <div class="info__updated">
                        Last update: ${data.updated_at} hours ago
                    </div>
                    <div class=${catClass}>
                        ${data.categories}
                    </div>
                </div>
            </div>
        `;
    jokesDOM.insertAdjacentHTML('afterbegin', joke)
  }

  getFavButtons() {
    let addToFav = document.querySelector('.img');

    let id = addToFav.dataset.id;

    if (localStorage.getItem('fav') != null) {
      fav = JSON.parse(localStorage.getItem('fav'));
    }


    addToFav.addEventListener('click', (event) => {
      addToFav.style.background = 'url("./img/fav-enabled.png")';
      addToFav.style.cursor = 'not-allowed';
      event.target.disabled = true;
      let favItem = Storage.getJoke(id);
      fav = [...fav, favItem];
      Storage.saveFav(fav);
      this.addFavJoke(...JSON.parse(localStorage.getItem('fav')));

    });

  }

  addFavJoke(...jokes) {
    let favs = document.createElement('div');
    favs.classList.add('favs');

    jokes.map(joke => {
      favs.innerHTML = `
                <div class="fav-joke" id=${joke.id}>
                    <button class="img-fav" data-id=${joke.id}></button>
                    <div class="fav-joke__id">
                        ID: <a href="https://api.chucknorris.io/jokes/${joke.id}">${joke.id}</a><img src="img/link.png" alt="">
                    </div>
                    <div class="fav-joke__text">
                        ${joke.value}
                    </div>
                    <div class="fav-joke__info">
                        <div class="fav-info__updated">
                            Last update: ${joke.updated_at} hours ago
                        </div>
                    </div>
                </div>
        `;
    });
    favDOM.prepend(favs);
    favDOMMobile.prepend(favs.cloneNode(true));
  }
}


class Storage {
  static saveJoke(joke) {
    localStorage.setItem(joke.id, JSON.stringify(joke));
  }

  static getJoke(id) {
    let jokes = [JSON.parse(localStorage.getItem(id))];
    return jokes.find(joke => joke.id === id)
  }

  static saveFav() {
    localStorage.setItem('fav', JSON.stringify(fav));
  }

  static deleteFav(id) {
    let favJokes = JSON.parse(localStorage.getItem('fav'));
    favJokes.map((joke,index) => {
      if(joke.id === id) {
        favJokes.splice(index, 1);
        localStorage.setItem('fav', JSON.stringify(favJokes));
        let jokeFavShouldBeDeleted = document.querySelectorAll(`#${id}`);
        jokeFavShouldBeDeleted.forEach(joke => joke.remove());
      }
    });
  }
}

getJokeBtn.addEventListener('click', () => {

  if (randomInput.checked) {
    let randomJoke = new Joke();
    let displayJoke = new DisplayJoke();

    randomJoke.getRandomJoke().then(data => {
      displayJoke.displayJoke(data, 'img',);
      Storage.saveJoke(data);
    }).then(() => {
      displayJoke.getFavButtons();
    });
  } else if (categoriesInput.checked) {
    let categoryJoke = new Joke();
    let displayJoke = new DisplayJoke();

    categoryJoke.getCategoryJoke().then(data => {

      if(data.categories.length !== 0) {
        displayJoke.displayJoke(data, 'img', 'info__category');
        Storage.saveJoke(data);
      } else {
        displayJoke.displayJoke(data, 'img');
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
        displayJoke.displayJoke(data, 'img', 'info__category');
        Storage.saveJoke(data);
      } else {
        displayJoke.displayJoke(data, 'img');
        Storage.saveJoke(data);
      }

    }).then(() => {
      displayJoke.getFavButtons();
    });
  }

});




document.addEventListener("click", (event) => {
  if (event.target.className === 'img-fav') {
    let id = event.target.dataset.id;
    Storage.deleteFav(id);
  }
});





const showCategories = () => {
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

let radioInputs = document.querySelectorAll('.radio__input');
for (let i = 0; i < radioInputs.length; i++) {
  radioInputs[i].oninput = showCategories;
}


if (localStorage.getItem('fav') !== null) {
  let displayJoke = new DisplayJoke();
  let jokes = JSON.parse(localStorage.getItem('fav'));

  jokes.map(joke => {
    displayJoke.displayJoke(joke, 'fav-img');
    displayJoke.addFavJoke(joke);
  });
}





