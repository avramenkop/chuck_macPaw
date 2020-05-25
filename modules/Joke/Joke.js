let availableCategories = document.querySelectorAll('.radio-inserted__input');
let textInput = document.querySelector('.text-inserted__input');


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