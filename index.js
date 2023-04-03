const filmsUrl = 'http://localhost:3000/films';

const ulFilms = document.querySelector('ul#films');
const divFilmDetails = document.querySelector('div#film-details');

let filmsData = null;
let selectedFilmId = null;

// Fetch all films and display them in the list
function fetchAndDisplayFilms() {
  fetch(filmsUrl)
    .then(response => response.json())
    .then(data => {
      filmsData = data;
      displayFilmsList(film);
    });
}

// Display all films in the list
function displayFilmsList(film) {
  ulFilms.innerHTML = '';
  filmsData.forEach(film => {
    const li = document.createElement('li');
    li.textContent = film.title;
    li.classList.add('film', 'item');
    if (film.tickets_sold >= film.capacity) {
      li.classList.add('sold-out');
    }
    if (selectedFilmId === film.id) {
      li.classList.add('selected');
    }
    li.addEventListener('click', () => {
      selectedFilmId = film.id;
      displayFilmDetails();
    });
    ulFilms.appendChild(li);
  });
}

// Fetch the details of a single film and display them
function displayFilmDetails() {
  const selectedFilm = filmsData.find(film => film.id === selectedFilmId);
  if (!selectedFilm) {
    divFilmDetails.innerHTML = '<p>No film selected</p>';
    return;
  }
  const {
    title,
    runtime,
    showtime,
    description,
    tickets_sold,
    capacity,
    poster
  } = selectedFilm;

  let statusText = 'Available';
  let buttonDisabled = false;
  if (tickets_sold >= capacity) {
    statusText = 'Sold Out';
    buttonDisabled = true;
  }

  divFilmDetails.innerHTML = `
    <h2>${title}</h2>
    <img src="${poster}" alt="${title} poster">
    <dl>
      <dt>Runtime</dt>
      <dd>${runtime} minutes</dd>
      <dt>Showtime</dt>
      <dd>${showtime}</dd>
      <dt>Description</dt>
      <dd>${description}</dd>
      <dt>Status</dt>
      <dd>${statusText}</dd>
    </dl>
    <button id="buy-ticket" ${buttonDisabled ? 'disabled' : ''}>Buy Ticket</button>
  `;

  const buttonBuyTicket = document.querySelector('button#buy-ticket');
  buttonBuyTicket.addEventListener('click', () => {
    if (selectedFilm.tickets_sold < selectedFilm.capacity) {
      selectedFilm.tickets_sold++;
      fetch(`${filmsUrl}/${selectedFilm.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets_sold: selectedFilm.tickets_sold
        })
      })
        .then(response => response.json())
        .then(data => {
          selectedFilm = data;
          displayFilmsList();
          displayFilmDetails();
        });
    } else {
      buttonBuyTicket.disabled = true;
      divFilmDetails.querySelector('dt:contains("Status") + dd').textContent = 'Sold Out';
      const liSoldOut = document.createElement('li');
      liSoldOut.textContent = selectedFilm.title;
      liSoldOut.classList.add('sold-out', 'film', 'item');
      ulFilms.replaceChild(liSoldOut, ulFilms.querySelector('li.selected'));
    }
  });
}

// Delete a film
function deleteFilm(id) {
  fetch(`${filmsUrl}/${id}`,
  )}