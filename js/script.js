const global = {
    currentPage : window.location.pathname
}

function highLightActiveLink(){
    const links = document.querySelectorAll('.nav-link');

    links.forEach((link)=>{
        if (link.getAttribute('href') === global.currentPage){
            link.classList.add('active')
        }
    })
} 

async function displayPopularMovies(){
    const {results} = await fetchApiData('movie/popular');

    results.forEach(movie=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path?
                `<img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="movie.title"
                    />
                    `:
                    `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="movie.title"
                        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;
        document.querySelector('#popular-movies').
        appendChild(div);
    });
}

//tv shows
async function displayPopularShows(){
    const {results} = await fetchApiData('tv/popular');

    results.forEach(tvShow=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          <a href="tv-details.html?id=${tvShow.id}">
            ${
                tvShow.poster_path?
                `<img
                    src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}"
                    class="card-img-top"
                    alt="${tvShow.name}"
                    />
                    `:
                    `<img
                        src="images/no-image.jpg"
                        class="card-img-top"
                        alt="${tvShow.name}"
                        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${tvShow.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${tvShow.first_air_day}</small>
            </p>
          </div>
        `;
        document.querySelector('#popular-shows').
        appendChild(div);
    });
}

async function displayMovieDetails(){
    const movieId = window.location.search.split('=')[1];

    const movie = await fetchApiData(`movie/${movieId}`);

    // Overlay or backgroundImage
    displayBackgroundImage('movie',movie.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML=`
        
        <div class="details-top">
          <div>
          ${
            movie.poster_path?
            `<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.name}"
                />
                `:
                `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.name}"
                    />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map(genre => `
                <li>${genre.name}</li>`).join('')
              }
            </ul>
            <a href="${movie.homepage}"
             target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies.map((company)=>
              `<span>${company.name}</span>`).join(', ')}
            </div>
          
        </div>
    `
    document.querySelector('#movie-details').appendChild(div);
}

//shows
async function displayShowDetails(){
    const showId = window.location.search.split('=')[1];

    const show = await fetchApiData(`tv/${showId}`);

    // Overlay or backgroundImage
    displayBackgroundImage('tv',show.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML=`
        
        <div class="details-top">
          <div>
          ${
            show.poster_path?
            `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />
                `:
                `<img
                    src="images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.name}"
                    />`
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Last air date Date: ${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map(genre => `
                <li>${genre.name}</li>`).join('')
              }
            </ul>
            <a href="${show.homepage}"
             target="_blank" class="btn">Visit show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last episode to air:</span> ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${show.production_companies.map((company)=>
              `<span>${company.name}</span>`).join(', ')}
            </div>
          
        </div>
    `
    document.querySelector('#show-details').appendChild(div);
}

// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath){
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1'; 

  switch (type){
    case 'movie':
      document.querySelector('#movie-details').appendChild(overlayDiv);
      break;
    case 'tv':
      document.querySelector('#show-details').appendChild(overlayDiv);
      break;
  }
}

async function fetchApiData(endpoint){
    const API_KEY = 'd96e23ff4e3b9a2908e0c22f835ce695';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpiner();
    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    hideSpiner();
    return await response.json();

}

function showSpiner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpiner(){
    document.querySelector('.spinner').classList.remove('show');
}

function addCommasToNumber(number){
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // return number.toLocaleString('en')
}


function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails()
            break;
        case '/tv-details.html':
            displayShowDetails()
            break;
        case '/search.html':
            console.log('search-details')
            break;
    }
    highLightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)