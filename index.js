
fetch("db.json")
  .then(response => response.json())
  .then(data => {
    // 2. Extract details of the first movie
    const movie = data.films[0];
    const { poster, title, runtime, showtime, capacity, tickets_sold } = movie;
    availableTickets = capacity - tickets_sold;    // 3. Set details in the HTML elements
    document.getElementById('poster').src = poster;
    document.getElementById('title').textContent = title;
    document.getElementById('runtime').textContent = `${runtime} mins`;
    document.getElementById('showtime').textContent = showtime;
    document.getElementById('available-tickets').textContent = availableTickets;    // 4. Create movie list
    const filmsList = document.getElementById('films');
    data.films.forEach(movie => {
      const { id, title, poster, showtime } = movie;
      const li = document.createElement('li');
      li.innerHTML = `<img src="${poster}" alt="${title}"><div><h4>${title}</h4><p>Showtime: ${showtime}</p></div>`;
      li.addEventListener('click', () => showMovieDetails(id));
      filmsList.appendChild(li);
        });    // 5. Set up buy ticket button click event taking buyTicket as a callback
    document.getElementById('buy-ticket').addEventListener('click', buyTicket);
    })
    .catch(error => {
    console.log(error);
    });    // buyTicket function decreases the number of available votes by one after every
    // click of the Buy Ticket button. The button greys out (is disabled)
    // and becomes ineffective once the available votes reaches 0.
    function buyTicket() {
      if (availableTickets > 0) {
        availableTickets--;
        document.getElementById('available-tickets').textContent = availableTickets;
        if (availableTickets === 0) {
          const buyButton = document.getElementById('buy-ticket');
          buyButton.textContent = 'Sold Out';
          buyButton.disabled = true;
        }
      }}    // Function to update the movie details
    function updateMovieDetails(movie) {
      const { poster, title, runtime, showtime, capacity, tickets_sold } = movie;
      availableTickets = capacity - tickets_sold;
      document.getElementById('poster').src = poster;
      document.getElementById('title').textContent = title;
      document.getElementById('runtime').textContent = `${runtime} mins`;
      document.getElementById('showtime').textContent = showtime;
      document.getElementById('available-tickets').textContent = availableTickets;
    }
    // Function to show movie details when a movie is clicked
    function showMovieDetails(id) {
      fetch("db.json")
        .then(response => response.json())
        .then(data => {
          const movie = data.films.find(movie => movie.id === id);
          if (movie) {
            updateMovieDetails(movie);
          }
        })
      .catch(error => console.error(error));
}