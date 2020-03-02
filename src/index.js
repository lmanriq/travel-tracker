import $ from 'jquery';
import dom from './domUpdates';
import User from './classes/User';
import Traveler from './classes/Traveler';
import Trip from './classes/Trip';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELERS_ENDPOINT, TRIPS_ENDPOINT, DESTINATIONS_ENDPOINT } from './constants/constants';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

const state = {
  currentUser: new User(),
  trips: null,
  destinations: null
}

dom.loadLogin();
const getUserDetails = (login) => {
  window.fetch(BASE + TRAVELERS_ENDPOINT + login)
    .then(response => {
      console.log(response.status)
      return response.json()
    })
    .then(data => data)
    .then(data => {
      state.currentUser = new Traveler(data, state.trips);
      state.trips = state.currentUser.myTrips.map(trip => new Trip(trip));
      dom.loadTraveler(state);
    })
    .catch(error => {
      console.log(error.message)
    })
}

export const findUser = (e) => {
  const credentials = dom.loginUser();
  const login = state.currentUser.logIn(credentials.username, credentials.password, e.data)
  if (login === 0) {
    console.log(state.currentUser)
    state.currentUser = new TravelAgency(state.currentUser);
    dom.loadTravelAgent(state);
  } else if (login > 0) {
    getUserDetails(login);
  } else {
    $('#incorrect-login-alert').text(login).hide().fadeIn(1000).delay(1000).fadeOut(1000);
  }
}

export const getData = (endpoint) => {
  return fetch(BASE + endpoint)
    .then(response => {
      console.log(response.status)
      return response.json()
    })
    .catch(error => {
      console.log(error.message)
    })
}

Promise.all([getData(TRIPS_ENDPOINT), getData(DESTINATIONS_ENDPOINT), getData(TRAVELERS_ENDPOINT)])
  .then(data => {
    const [tripData, destinationData, travelerData] = data;
    state.trips = tripData.trips.map(trip => new Trip(trip));
    state.destinations = destinationData.destinations.sort((a, b) => {
      if (a.destination.toLowerCase() < b.destination.toLowerCase()) {
        return -1;
      } else {
        return 1;
      };
    });
    state.travelers = travelerData.travelers;
  })
  .catch(error => {
    throw error;
  })

dom.bindLoginButton(state) ;
