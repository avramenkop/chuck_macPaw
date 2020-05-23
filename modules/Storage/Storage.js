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