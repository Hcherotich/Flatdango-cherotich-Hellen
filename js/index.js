document.addEventListener('DOMContentLoaded', () => {
    const filmsList = document.getElementById('films');
    const movieDetails = document.getElementById('movie-details');

    // Fetch movies list from the server
    fetchMovies();

    function fetchMovies() {
        fetch('http://localhost:3000/films')
            .then(response => response.json())
            .then(films => {
                films.forEach(film => {
                    const filmItem = createFilmItem(film);
                    filmsList.appendChild(filmItem);
                });

                // Display details of the first movie by default
                if (films.length > 0) {
                    displayMovieDetails(films[0]);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    function createFilmItem(film) {
        const filmItem = document.createElement('li');
        filmItem.classList.add('movie-item');
        filmItem.textContent = film.title;
        filmItem.addEventListener('click', () => {
            displayMovieDetails(film);
        });
        return filmItem;
    }

    function displayMovieDetails(movie) {
        const ticketsAvailable = movie.capacity - movie.tickets_sold;
        const isSoldOut = ticketsAvailable === 0;

        let detailsHTML = `
            <img src="${movie.poster}" alt="${movie.title} poster">
            <h3>${movie.title}</h3>
            <p>Runtime: ${movie.runtime} minutes</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Tickets Available: ${ticketsAvailable}</p>
            <button id="buy-ticket-btn" ${isSoldOut ? 'disabled' : ''}>${isSoldOut ? 'Sold Out' : 'Buy Ticket'}</button>
        `;

        movieDetails.innerHTML = detailsHTML;

        const buyTicketBtn = document.getElementById('buy-ticket-btn');
        buyTicketBtn.addEventListener('click', () => {
            if (!isSoldOut) {
                ticketsAvailable--;
                movie.tickets_sold++;
                movieDetails.querySelector('p:nth-child(4)').textContent = `Tickets Available: ${ticketsAvailable}`;
                if (ticketsAvailable === 0) {
                    buyTicketBtn.textContent = 'Sold Out';
                    buyTicketBtn.disabled = true;
                    filmsList.querySelector(`[data-id="${movie.id}"]`).classList.add('sold-out');
                }
            }
        });
    }
});
