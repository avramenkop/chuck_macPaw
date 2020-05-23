let jokesDOM = document.querySelector('.jokes');
let favDOM = document.querySelector('.favourite__jokes');
let favDOMMobile = document.querySelector('.favourite__jokes-mobile');


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
                    <div class="joke__updated">
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
    let addToFav = document.querySelector('.add-to-fav');
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
                    <button class="delete-fav" data-id=${joke.id}></button>
                    <div class="fav-joke__id">
                        ID: <a href="https://api.chucknorris.io/jokes/${joke.id}">${joke.id}</a><img src="img/link.png" alt="">
                    </div>
                    <div class="fav-joke__text">
                        ${joke.value}
                    </div>
                    <div class="fav-joke__info">
                        <div class="fav-joke__updated">
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