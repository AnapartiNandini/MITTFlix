let allMovies;

fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=0b941991fb739be72fed42ae5e2a4891`)
  .then(resp => resp.json())
  .then(movies => {
    console.log(movies)
    allMovies = movies.results;
    return fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=0b941991fb739be72fed42ae5e2a4891&language=en-US`)      
  })
  .then(resp => resp.json())
  .then(json => {    
    usedGenres = makeUniqueGenres(json, allMovies);
    appendToHTML(usedGenres);
    console.log(usedGenres);
  });
   

function makeUniqueGenres(results, allMovies) {
  console.log(results)
  const usedGenres = {}
  results.genres.forEach(genre => {
    allMovies.forEach(movie => {        
      if (movie.genre_ids.includes(genre.id)) {
        if(usedGenres[genre.name] === undefined) {
          usedGenres[genre.name] = [movie]
        } else {
          usedGenres[genre.name].push(movie);
        }
      }
    });
  })

  return usedGenres;
}

function appendToHTML(usedGenres) {
  const main = document.querySelector('#root');

  Object.keys(usedGenres).forEach(genreName => {
    let html = `
      <div class="titleList">
        <div class="title">
          <h1>${genreName}</h1>
          <div class="titles-wrapper">
      `;

    usedGenres[genreName].forEach(movie => {
      html += `
        <div class="movie">
        <img
          src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}"
        />
        <div class="overlay">
          <div class="title">${movie.title}</div>
          <div class="rating">${movie.vote_average}/10</div>
          <div class="plot">
            ${movie.overview}
          </div>
          <div class="listToggle">
            <div>
              <i class="fa fa-fw fa-plus"></i>
              <i class="fa fa-fw fa-check"></i>
            </div>
          </div>
        </div>
      </div>
      `
    });

    html += `</div></div></div>`

    main.insertAdjacentHTML('beforeend', html);
  });
}