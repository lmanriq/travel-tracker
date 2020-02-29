import $ from 'jquery';
import Traveler from './classes/Traveler';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELER_ENDPOINT } from './constants/constants';
import {
  findUser
} from './index';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import datepicker from 'js-datepicker'
moment().format();


const dom = {
  bindLoginButton(state) {
    $('.btn--login').on('click', null, state, findUser)
  },

  bindSubmitBtn(state) {
    $('.btn--submit').on('click', null, state, dom.submitTripRequest)
  },

  addDatePicker() {
    const start = datepicker('#start-date-picker', {
      id: 1,
      minDate: new Date()
    })
    const end = datepicker('#end-date-picker', {
      id: 1,
      minDate: new Date()
    });
  },

  loadTraveler(state) {
    dom.loadDashboard(state);
    dom.displayTrips(state);
    dom.displayAmountSpentTraveler(state);
    dom.addDatePicker();
    dom.addDestinationOptions(state);
    dom.bindSubmitBtn(state);
  },

  submitTripRequest(e) {
    e.preventDefault();
    const startDate = $('#start-date-picker').val();
    const endDate = $('#end-date-picker').val();
    const range = moment.range(startDate, endDate);
    const duration = Array.from(range.by('day')).length;
    console.log(duration)
  },

  addDestinationOptions(state) {
    const destinationOptions = state.destinations.map(dest => {
      return `<option value="${dest.destination}">${dest.destination}</option>`
    })
    const destHTML = destinationOptions.join('');
    $('#destination-choices').html(destHTML);
  },

  makeTripCard(trip, destination, current) {
    const startDate = moment(trip.date).format('l');
    let endDate = moment(startDate).add(trip.duration, 'days').calendar();
    endDate = moment(endDate).format('l');
    return `<article class='${current ? current : ''} trip'>
      <div class='trip-details'>
        <h3>${destination.destination}</h3>
        <p>${startDate} - ${endDate}</p>
      </div>
      <img src="${destination.image}" alt="${destination.alt}" class="${trip.status}">
    </article>`
  },

  displayAmountSpentTraveler(state) {
    let amount = state.currentUser.calculateTotalAmountSpent(state.destinations);
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $('#amount-spent').text(amount)
  },

  displayTrips(state) {
    const currentTrips = state.currentUser.showCurrentTrips(state.trips);
    const pastTrips = state.currentUser.showPastTrips(state.trips);
    const futureTrips = state.currentUser.showFutureTrips(state.trips);
    const currentTripCards = currentTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination, 'current');
    })
    const futureTripCards = futureTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination)
    })
    const pastTripCards = pastTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination)
    })
    $('.current-trips').html(currentTripCards.join('') + futureTripCards.join(''));
    $('.past-trips').html(pastTripCards.join(''))
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
