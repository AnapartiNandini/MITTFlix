let api_key = 'a2fabed3f0a936c4ebc2bc4bea53b00c';
let apikey = "9ba03c1d";
let titles = document.querySelector('.titles-wrapper');
let formElement = document.querySelector('#search');
let inputElement = formElement.querySelector('input');
let next = document.querySelector('#next');
let previous = document.querySelector('#previous');
let page_number = 1;

formElement.onsubmit = e => {
  e.preventDefault();
  if (inputElement.value.length > 0) {
    fetch(`http://www.omdbapi.com/?apikey=${apikey}&s=${inputElement.value}`)
      .then(response => response.json())
      .then(json => {
        json.Search.forEach(movie => {
          titles.textContent = "";
          previous.hidden = true;
          next.hidden = true;

          fetch(`http://www.omdbapi.com/?apikey=${apikey}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(movie => { 
              let poster = `<img src="${movie.Poster}"/>`;
              
              if (movie.Poster === "N/A") {
                poster = `<picture>
                  <source type="image/avif" srcset="images/placeholder-movieimage.avif">
                  <img src="images/placeholder-movieimage.png">
                </picture>`;
              }
               
              titles.insertAdjacentHTML('afterbegin', `<div class="movie">
                ${poster}
                <div class="overlay">
                  <div class="title">${movie.Title}</div>
                  <div class="rating">${movie.imdbRating}/10</div>
                  <div class="plot">
                    ${movie.Plot}
                  </div>
                </div>
              </div>`);
          });
        })
      });
  }
}

fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page_number}`)
  .then(response => response.json())
  .then(data => {
    populatePage(data.results);
    adjustPagination(data.total_pages);
  });

next.onclick = function () {
  ++page_number;
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page_number}`)
    .then(response => response.json())
    .then(data => {
      populatePage(data.results);
      adjustPagination(data.total_pages);
    });
}

previous.onclick = function () {
  --page_number;
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page_number}`)
    .then(response => response.json())
    .then(data => {
      populatePage(data.results);
      adjustPagination(data.total_pages);
    });
}

function adjustPagination(totalPages) {
  if (page_number === 1) {
    previous.hidden = true;
  } else {
    previous.hidden = false;
  }

  if (page_number === totalPages) {
    next.hidden = true;
  } else {
    next.hidden = false;
  }
}

function populatePage(movies) {
  titles.textContent = "";
  for (let movie of movies) {
    let poster = `<img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}"/>`;

    if (movie.backdrop_path === undefined) {
      poster = `<picture>
      <source type="image/avif" srcset="images/placeholder-movieimage.avif">
      <img src="images/placeholder-movieimage.png">
    </picture>`;
    }

    titles.insertAdjacentHTML("afterbegin", `<div class="movie">
      ${poster}
      <div class="overlay">
        <div class="title">${movie.title}</div>
        <div class="rating">${movie.vote_average}/10</div>
        <div class="plot">
          ${movie.overview}
        </div>
      </div>
    </div>`
    )
  }
}