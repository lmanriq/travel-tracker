import $ from 'jquery';
import Traveler from './classes/Traveler';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELER_ENDPOINT } from './constants/constants';
import {
  findUser
} from './index';


const dom = {
  bindLoginButton(state) {
    $('.btn--login').on('click', null, state, findUser)
  },

  bindEvents(state) {
    // $('.btn--login').on('click', null, state, dom.loginUser)
  },

  displayTrips(trips, state) {
    const tripImgs = trips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      console.log(destination)
      const img = destination.image;
      const altText = destination.alt;
      const status = trip.status;
      return `<img src="${img}" alt="${altText}" class="${status}">`
    })
    $('.trips-article').html(tripImgs.join(''));
  },

  loadDashboard(state) {
    $('.login-screen').fadeOut(1500);
    $('.traveler-dashboard').toggleClass('hidden');
    const firstName = state.currentUser.name.split(' ')[0].toLowerCase();
    $('#username-span').text(firstName);
  },

  loadLogin() {
    $('.login-screen').hide().fadeIn(1500);
  },

  loginUser() {
    const username = $('#username-input').val();
    const password = $('#password-input').val();
    return {
      username,
      password
    }
  }
}

export default dom;
