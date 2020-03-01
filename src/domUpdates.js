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

  bindDashBtns(state) {
    $('.btn--submit').on('click', function() {
      dom.submitTripRequest(state);
    });
    $('.btn--pending').on('click', function() {
      dom.showPendingTrips(state);
    });
    $('.btn--all').on('click', function() {
      dom.displayTrips(state);
    });
  },

  showPendingTrips(state) {
    const user = state.currentUser;
    const pending = user.showPendingTrips(state.trips);
    const pendingCards = pending.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination);
    })
    $('.current-trips').html(pendingCards.join(''));
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
    dom.bindDashBtns(state);
  },

  submitTripRequest(e) {
    e.preventDefault();
    if($('#start-date-picker').val() && $('#end-date-picker').val()
    && $('#travelers-input') && $('#destination-choices').val()) {
      let startDate = $('#start-date-picker').val();
      const endDate = $('#end-date-picker').val();
      const range = moment.range(startDate, endDate);
      const duration = Array.from(range.by('day')).length;
      startDate = moment(startDate).format("YYYY/MM/DD");
      const travelers = $('#travelers-input').val();
      const destinationID = $('#destination-choices').find('option:selected').attr('id');
      state.currentUser.requestTrip(destinationID, travelers, startDate, duration);
      state.trips = state.currentUser.myTrips;
      $('#required').text('wander request successfully submitted').hide().fadeIn(2000).delay(1000).fadeOut(2000);
      dom.displayTrips(state);
    } else {
      $('#required').text('all fields are required').hide().fadeIn(2000).delay(1000).fadeOut(2000);
    }
  },

  addDestinationOptions(state) {
    const destinationOptions = state.destinations.map(dest => {
      return `<option id="${dest.id}" value="${dest.destination}">${dest.destination}</option>`
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
        <p>${trip.status}</p>
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
    const data = state;
    const currentTrips = data.currentUser.showCurrentTrips(data.trips);
    const pastTrips = data.currentUser.showPastTrips(data.trips);
    const futureTrips = data.currentUser.showFutureTrips(data.trips);
    const currentTripCards = currentTrips.map(trip => {
      const destination = data.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination, 'current');
    })
    const futureTripCards = futureTrips.map(trip => {
      const destination = data.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination)
    })
    const pastTripCards = pastTrips.map(trip => {
      const destination = data.destinations.find(destination => destination.id === trip.destinationID);
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
