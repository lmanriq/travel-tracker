import $ from 'jquery';
import Traveler from './classes/Traveler';
import Trip from './classes/Trip';
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
    $('.btn--submit').on('click', null, state, dom.submitTripRequest);
    $('.btn--pending').on('click', function() {
      dom.showPendingTrips(state);
    });
    $('.btn--price').on('click', null, state, dom.showCostBreakdown);
    $('.btn--all').on('click', function() {
      dom.displayTrips(state);
    });
  },

  bindAgentBtns(state) {
    $('.btn--pending').on('click', function() {
      dom.showPendingTrips(state);
    });
    $('.btn--all').on('click', function() {
      dom.displayTrips(state);
    });
    $('.current-trips').on('click', '.trip', state, dom.showAgencyTravelDetails);
    $('.expanded-trip-details').on('click', '.btn--exit', state, dom.hideTripDetails);
    $('.expanded-trip-details').on('click', '.btn--approve', state, dom.approvePendingTrip);
    $('.expanded-trip-details').on('click', '.btn--deny', state, dom.denyPendingTrip);
  },

  hideTripDetails(e) {
    $('.expanded-trip-details').toggleClass('hidden');
    dom.displayTrips(e.data);
  },

  approvePendingTrip(e) {
    const tripID = parseInt($('.expanded-trip-details').attr('id'));
    e.data.currentUser.approveRequest(tripID);
    $('#success-msg').text('Trip successfully approved.')
  },

  denyPendingTrip(e) {
    const tripID =parseInt($('.expanded-trip-details').attr('id'));
    e.data.currentUser.denyRequest(tripID, e.data.trips);
    $('#success-msg').text('Trip successfully denied.')
  },

  showCostBreakdown(e) {
    let trip = dom.grabTripDetails(e.data);
    if (trip) {
      trip.userId = e.data.currentUser.id;
      trip = new Trip(trip);
      const breakdown = trip.calculateCostBreakdown(e.data.destinations);
      $('#price').html(`<p>Flights: $${breakdown.flightCost}, Lodging: $${breakdown.lodgingCost},
        Service Fee: $${breakdown.serviceFee}</p><p>Total: $${breakdown.totalCost}</p>`)
    } else {
      $('#required').text('all fields are required').hide().fadeIn(2000).delay(1000).fadeOut(2000);
    }
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

  loadTravelAgent(state) {
    dom.loadDashboard(state);
    dom.showCurrentTravelers(state);
    dom.displayTravelerSearch(state);
    dom.displayTrips(state);
    dom.displayTotalRevenue(state);
    dom.bindAgentBtns(state)
  },

  showCurrentTravelers(state) {
    const currentTravelers = state.currentUser.showCurrentTrips(state.trips).length;
    $('.welcome-banner').append(`<h2>current wanderers: ${currentTravelers}</h2>`)
  },

  displayTravelerSearch(state) {
    $('#side-header').text('search all wanderers');
    const searchForm = `<label for="traveler-search">name:</label>
      <input id="traveler-search" type="text">
      <button class="btn btn--search" type="button" name="search">search</button>`
    $('.trip-form').html(searchForm);
  },

  grabTripDetails(state) {
    if($('#start-date-picker').val() && $('#end-date-picker').val()
    && $('#travelers-input') && $('#destination-choices').val()) {
      let startDate = $('#start-date-picker').val();
      const endDate = $('#end-date-picker').val();
      const range = moment.range(startDate, endDate);
      const duration = Array.from(range.by('day')).length;
      startDate = moment(startDate).format("YYYY/MM/DD");
      const travelers = parseInt($('#travelers-input').val());
      const destinationID = parseInt($('#destination-choices').find('option:selected').attr('id'));
      return {
        date: startDate,
        destinationID,
        travelers,
        duration
      }
    }
  },

  submitTripRequest(e) {
    e.preventDefault();
    const trip = dom.grabTripDetails(e.data);
    if (trip) {
      e.data.currentUser.requestTrip(trip.destinationID, trip.travelers, trip.date, trip.duration)
        .then(data => {
          e.data.trips = e.data.currentUser.myTrips;
          dom.displayTrips(e.data)
        })
      $('#required').text('wander request successfully submitted').hide().fadeIn(2000).delay(1000).fadeOut(2000);
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
    return `<article id="${trip.id}"" class="trip">
      <div class="${current || ''} trip-details">
        <h3>${destination.destination}</h3>
        <p>${startDate} - ${endDate}</p>
        <p>${trip.status}</p>
      </div>
      <img src="${destination.image}" alt="${destination.alt}" class="${trip.status}">
    </article>`
  },

  showAgencyTravelDetails(e) {
    const targetID = parseInt($(this).closest('.trip').attr('id'));
    const targetTrip = e.data.trips.find(trip => trip.id === targetID);
    const user = e.data.travelers.find(user => user.id === targetTrip.userID);
    const destination = e.data.destinations.find(dest => dest.id === targetTrip.destinationID);
    const cost = targetTrip.calculateCostBreakdown(e.data.destinations);
    const buttonHTML = `<div class="btn-container">
        <button class="btn btn--approve" type="button" name="approve">approve</button>
        <button class="btn btn--deny" type="button" name="deny">deny</button>
      </div>`
    const detailsHTML = `
    <button class="btn btn--exit" type="button" name="exit">x</button>
    <h2>${destination.destination.toLowerCase()}</h2>
    <h2>${user.name.toLowerCase()}</h2>
    <p>duration: ${targetTrip.duration}</p>
    <p>wanderers: ${targetTrip.travelers}</p>
    <p>status: ${targetTrip.status}</p>
    <p>total cost: $${cost.totalCost.toFixed(2)}</p>
    <p>agency percentage: $${cost.serviceFee.toFixed(2)}</p>
    <p id="success-msg"></p>
    ${targetTrip.status === 'approved' ? '' : buttonHTML}
    `
    $('.expanded-trip-details').toggleClass('hidden');
    $('.expanded-trip-details').attr('id', targetID);
    $('.expanded-trip-details').html(detailsHTML)
  },

  displayTotalRevenue(state) {
    let amount = state.currentUser.calculateTotalRevenue(state.travelers, state.destinations, state.trips);
    amount = amount.toFixed(2);
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $('#amount-spent').text(amount);
  },

  displayAmountSpentTraveler(state) {
    let amount = state.currentUser.calculateTotalAmountSpent(state.destinations);
    amount = amount.toFixed(2);
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
    });
    $('.current-trips').html(currentTripCards.join('') + futureTripCards.join(''));
    $('.past-trips').html(pastTripCards.join(''));
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
