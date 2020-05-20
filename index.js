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

let fav = [];


class Joke {
    async getRandomJoke() {
        try {
            let response = await fetch('https://api.chucknorris.io/jokes/random');
            let data = await response.json();
            const {id, value, updated_at, categories} = data;
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
                    const {id, value, updated_at, categories} = data;
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
                const {id, value, updated_at, categories} = data.result[randIndex];
                textInput.value = '';
                return {id, value, updated_at, categories}
            } catch (error) {
                console.error(error);
            }
        }
    }
}


class DisplayJoke {
    displayJoke(data, btnClass) {
        let joke = '';
        joke = `
            <div class="joke">
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
                    <div class="info__category">
                        ${data.categories}
                    </div>
                </div>
            </div>
        `;
        jokesDOM.insertAdjacentHTML('afterbegin', joke)
    }

    getFavButtons() {
        let addToFav = [...document.querySelectorAll('.img')];
        addToFav.forEach(button => {
            let id = button.dataset.id;

            if (localStorage.getItem('fav') != null) {
                fav = JSON.parse(localStorage.getItem('fav'));
            }

            let inFav = fav.find(item => item.id === id);
            if (inFav) {
                button.disabled = true;
            }

            button.addEventListener('click', (event) => {
                button.style.background = 'url("./img/fav-enabled.png")';
                event.target.disabled = true;
                let favItem = Storage.getJoke(id);
                fav = [...fav, favItem];
                console.log(fav);
                Storage.saveFav(fav);
                this.addFavJoke(...JSON.parse(localStorage.getItem('fav')));
            });

        })
    }

    addFavJoke(...jokes) {
        let favs = document.createElement('div');
        favs.classList.add('favs');

        jokes.map(joke => {
            favs.innerHTML = `
                <div class="fav-joke">
                    <button class="img img-fav" data-id=${joke.id}></button>
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
        favDOM.prepend(favs)
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
}


getJokeBtn.addEventListener('click', () => {

    if (randomInput.checked) {
        let randomJoke = new Joke();
        let displayJoke = new DisplayJoke();

        randomJoke.getRandomJoke().then(data => {
            displayJoke.displayJoke(data, 'img', );
            Storage.saveJoke(data);
        }).then(() => {
            displayJoke.getFavButtons();
        });
    } else if (categoriesInput.checked) {
        let categoryJoke = new Joke();
        let displayJoke = new DisplayJoke();

        categoryJoke.getCategoryJoke().then(data => {
            displayJoke.displayJoke(data, 'img');
            Storage.saveJoke(data);
        }).then(() => {
            displayJoke.getFavButtons();
        });
    } else if (searchInput.checked) {
        let searchJoke = new Joke();
        let displayJoke = new DisplayJoke();

        searchJoke.getSearchJoke().then(data => {
            displayJoke.displayJoke(data, 'img', );
            Storage.saveJoke(data);
        }).then(() => {
            displayJoke.getFavButtons();
        });
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
        displayJoke.displayJoke(joke, 'img-fav');
        displayJoke.addFavJoke(joke);
    });
}




