// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you import jQuery into a JS file if you use jQuery in that file
import $ from 'jquery';
import dom from './domUpdates';
import User from './classes/User';
import Traveler from './classes/Traveler';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELER_ENDPOINT } from './constants/constants';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/plane-icon.svg'

const state = {
  currentUser: new User()
}

dom.loadLogin();
// dom.bindEvents(state);
export const getUserInfo = (e) => {
  console.log('sup')
  const credentials = dom.loginUser();
  const login = state.currentUser.logIn(credentials.username, credentials.password, e.data)
  if (login === 0) {
    state.currentUser = new TravelAgency(state.currentUser);
    dom.loadDashboard(state);
  } else if (login > 0) {
    window.fetch(BASE + TRAVELER_ENDPOINT + login)
      .then(response => {
        console.log(response.status)
        return response.json()
      })
      .then(data => data)
      .then(data => {
        console.log(data.name)
        state.currentUser = new Traveler(data);
        dom.loadDashboard(state)
      })
      .catch(error => {
        console.log(error.message)
      })
  } else {
    $('#incorrect-login-alert').text(login).hide().fadeIn(1000).delay(1000).fadeOut(1000);
  }
}

dom.bindLoginButton(state) ;


console.log('This is the JavaScript entry file - your code begins here.');
