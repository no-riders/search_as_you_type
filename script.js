// jshint esnext: true

// end point w/ JSON data of US cities
const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];
const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

// check if browser supports fetch API
function validate(response){
if (!(fetch in window)) {
	console.log('Fetch API is not supported by your browser, please update');
	return response;
}
}

//validate response
function validate(response) {
	if(!response.ok){
		throw Error(response.statusText);
	}
	return response;
}

// array of results from AJAX request
fetch(endpoint)
.then(validate)
.then(blob => blob.json())
.then(data => cities.push(...data)); // spread the data using ... so each item pushes to new array

// upon typing in search field, filter cities Arr to subset
function findMatch(wordToMatch, cities) {
	return cities.filter(place => {
		// if sity or state matches typed word
		const myRegex = new RegExp(wordToMatch, 'gi'); //regex = wordToMatch
		return place.city.match(myRegex) || place.state.match(myRegex);
	});
}

// puts commas btwn city and state
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// render Matches
function renderMatch() {
//	console.log(this.value); //whatever is typed in search field is logged to console
	 const matchArray = findMatch(this.value, cities);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi'); // to highlight what is searched
    // replacing what is searched with span that'd highlight what is searched
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
        <span class="population">${numberWithCommas(place.population)}${'ppl'}</span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

searchInput.addEventListener('change', renderMatch);
searchInput.addEventListener('keyup', renderMatch);