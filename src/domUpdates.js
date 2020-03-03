import $ from 'jquery';
import Traveler from './classes/Traveler';
import Trip from './classes/Trip';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELER_ENDPOINT, TRIPS_ENDPOINT } from './constants/constants';
import {
  findUser,
  getData,
  sortByDate
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

  bindUniversalBtns(state) {
    $('.btn--pending').on('click', function() {
      dom.showPendingTrips(state);
    });
    $('.btn--all').on('click', function() {
      dom.displayTrips(state);
    });
    $('.traveler-dashboard').on('click', '.trip', state, dom.showTravelDetails);
    $('.expanded-trip-details').on('click', '.btn--exit', state, dom.hideTripDetails);
    $('form').keypress(function(event) {
      return event.keyCode !== 13;
    });
  },

  bindTravelerBtns(state) {
    dom.bindUniversalBtns(state);
    $('.btn--submit').on('click', null, state, dom.submitTripRequest);
    $('.btn--price').on('click', null, state, dom.showCostBreakdown);
  },

  bindAgentBtns(state) {
    dom.bindUniversalBtns(state);
    $('.search-results-box').on('click', '.trip-entry', state, dom.showTravelDetails);
    $('.expanded-trip-details').on('click', '.btn--approve', state, dom.approvePendingTrip);
    $('.expanded-trip-details').on('click', '.btn--deny', state, dom.denyPendingTrip);
    $('.btn--search').on('click keyup', function(e) {
      dom.searchAllTravelers(state, e);
    });
    $('.btn--add-destination').on('click', dom.showDestinationForm);
    $('.expanded-trip-details').on('click', '.btn--confirm-add', state, dom.addNewDestination);
  },

  loadTraveler(state) {
    dom.loadDashboard(state);
    dom.displayTrips(state);
    dom.displayAmountSpentTraveler(state);
    dom.showCountdownDetails(state)
    dom.addDatePicker();
    dom.addDestinationOptions(state);
    dom.bindTravelerBtns(state);
  },

  loadTravelAgent(state) {
    dom.loadDashboard(state);
    dom.instertAddDestinationBtn();
    dom.showCurrentTravelers(state);
    dom.displayTravelerSearch(state);
    dom.displayTrips(state);
    dom.displayTotalRevenue(state);
    dom.bindAgentBtns(state)
  },

  addCommas(n) {
    return n.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

  addDestinationOptions(state) {
    const destinationOptions = state.destinations.map(dest => {
      return `<option id="${dest.id}" value="${dest.destination}">${dest.destination}</option>`
    })
    const destHTML = destinationOptions.join('');
    $('#destination-choices').html(destHTML);
  },

  addNewDestination(e) {
    const destination = $('#destination-name').val();
    const lodgingCost = parseInt($('#lodging-cost').val());
    const flightCost = parseInt($('#flight-cost').val());
    const url = $('#img-url').val();
    const alt = $('#img-alt').val();
    const result = e.data.currentUser.addNewDestination(destination, lodgingCost, flightCost, url, alt);
    if (result instanceof Promise) {
      e.data.destinations = getData(DESTINATIONS_ENDPOINT);
      $('#destination-confirmation').text('destination successfully added').hide().fadeIn(1000).delay(1000).fadeOut(1000);
    } else {
      $('#destination-confirmation').text(result).hide().fadeIn(1000).delay(1000).fadeOut(1000);
    }
  },

  approvePendingTrip(e) {
    const tripID = parseInt($('.expanded-trip-details').attr('id'));
    e.data.currentUser.approveRequest(tripID);
    $('#success-msg').text('Trip successfully approved.')
    dom.refreshTrips(e)
  },

  denyPendingTrip(e) {
    const tripID = parseInt($('.expanded-trip-details').attr('id'));
    e.data.currentUser.denyRequest(tripID, e.data.trips);
    $('#success-msg').text('Trip successfully denied.');
    dom.refreshTrips(e);
  },

  displayAmountSpentTraveler(state) {
    let amount = state.currentUser.calculateTotalAmountSpent(state.destinations);
    amount = dom.addCommas(amount);
    $('#amount-spent').text(amount);
  },

  displayTotalRevenue(state) {
    let amount = state.currentUser.calculateTotalRevenue(state.travelers, state.destinations, state.trips);
    amount = dom.addCommas(amount);
    $('#amount-spent').text(amount);
  },

  displayTravelerSearch(state) {
    $('#side-header').text('search all wanderers');
    const searchForm = `<label for="traveler-search">name:</label>
      <input id="traveler-search" type="text">
      <button class="btn btn--search" type="button" name="search">search</button>`
    $('.trip-form').html(searchForm);
    $('.search-results-box').html(`<div class="search-output"></div>`);
  },

  displayTrips(state) {
    const currentTrips = sortByDate(state.currentUser.showCurrentTrips(state.trips));
    const pastTrips = sortByDate(state.currentUser.showPastTrips(state.trips));
    const futureTrips = sortByDate(state.currentUser.showFutureTrips(state.trips));
    const currentTripCards = currentTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === parseInt(trip.destinationID));
      return dom.makeTripCard(trip, destination, 'current');
    })
    const futureTripCards = futureTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === parseInt(trip.destinationID));
      return dom.makeTripCard(trip, destination)
    })
    const pastTripCards = pastTrips.map(trip => {
      const destination = state.destinations.find(destination => destination.id === parseInt(trip.destinationID));
      return dom.makeTripCard(trip, destination, 'past')
    });
    $('.current-trips').html(currentTripCards.join('') + futureTripCards.join(''));
    $('.past-trips').html(pastTripCards.join(''));
  },

  refreshTrips(e) {
    getData(TRIPS_ENDPOINT)
      .then(data => {
        e.data.trips = data.trips.map(trip => new Trip(trip));
        dom.displayTrips(e.data);
      })
      .catch(error => {
        console.log(error.message)
      })
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

  hideTripDetails(e) {
    $('.expanded-trip-details').toggleClass('hidden');
    $('.overlay').remove();
  },

  instertAddDestinationBtn() {

    $('.spendings-box').append(`<button class="btn btn--add-destination" type="button" name="add-destination">add new destination</button>`)
  },

  loadDashboard(state) {
    $('.login-screen').hide();
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
  },

  makeTripCard(trip, destination, time) {
    const startDate = moment(trip.date).format('l');
    const status = time ? `${time} (${trip.status})` : trip.status;
    let endDate = moment(startDate).add(trip.duration, 'days').calendar();
    endDate = moment(endDate).format('l');
    return `<button id="${trip.id}" class="${time || ''} trip">
      <div class="${time} trip-details">
        <h3>${destination.destination.toLowerCase()}</h3>
        <p>${startDate} - ${endDate}</p>
        <p>${status}</p>
      </div>
      <img src="${destination.image}" alt="${destination.alt}" class="${trip.status}">
    </button>`
  },

  showCountdownClock(diff, destination) {
    let duration = moment.duration(diff * 1000, 'milliseconds');
    const interval = 1000;
    setInterval(function() {
      duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
      let days = moment.duration(duration).days();
      let hours = moment.duration(duration).hours();
      let mins = moment.duration(duration).minutes();
      let secs = moment.duration(duration).seconds();
      $('.countdown').text(`${days}d:${hours}h:${mins}m:${secs}s 'til your next wandering in ${destination.destination.toLowerCase()}`);
    }, interval);
  },

  showCountdownDetails(state) {
    const currentTrips = sortByDate(state.currentUser.showCurrentTrips(state.trips));
    const futureTrips = sortByDate(state.currentUser.showFutureTrips(state.trips));
    if (currentTrips.length) {
      const currentTrip = currentTrips[0];
      const destination = state.destinations.find(dest => dest.id === currentTrip.destinationID);
      $('.countdown').text(`you're in ${destination.destination.toLowerCase()}! happy wandering.`);
    } else if (futureTrips.length) {
      const nextTrip = futureTrips[0];
      const destination = state.destinations.find(dest => dest.id === nextTrip.destinationID);
      const travelDate = moment(nextTrip.date, 'YYYY/MM/DD').unix();
      const today = moment().unix();
      const diff = travelDate - today;
      dom.showCountdownClock(diff, destination);
    } else {
      $('.countdown').text(`no upcoming wanderings. schedule one today!`);
    }
  },

  showDestinationForm() {
    const destinationForm = `
    <button class="btn btn--exit" type="button" name="exit">x</button>
    <form class="new-destination-form">
      <h2>add a new destination</h2>
      <label for="destination-name">destination:</label>
      <input id="destination-name" type="text" placeholder="london, england">
      <label for="lodging-cost">lodging cost (usd):</label>
      <input id="lodging-cost" type="number" placeholder="555" min=0>
      <label for="flight-cost">flight cost (usd):</label>
      <input id="flight-cost" type="number" placeholder="444" min=0>
      <label for="img-url">image url:</label>
      <input id="img-url" type="text" placeholder="https://image.com">
      <label for="img-alt">image description:</label>
      <input id="img-alt" type="text" placeholder="a boat on tranquil waters">
      <p id="destination-confirmation"></p>
      <button class="btn btn--confirm-add" type="button" name="confirm add">add destination</button>
    </form>
    `
    $('.expanded-trip-details').before('<section class="overlay"></section>');
    $('.expanded-trip-details').toggleClass('hidden');
    $('.expanded-trip-details').addClass('expanded-destination-form');
    $('.expanded-trip-details').html(destinationForm);
    $('.btn--exit').focus();
  },

  showTravelerSearch(traveler, state) {
    let trips = traveler.myTrips.map(trip => {
      const dest = state.destinations.find(dest => dest.id === trip.destinationID);
      const startDate = moment(trip.date).format('l');
      let endDate = moment(trip.date).add(trip.duration, 'days').calendar();
      endDate = moment(endDate).format('l');
      return `<button type="button" data-id="${trip.id}" class="trip-entry"><p>${dest.destination} (${trip.status})</p><p>${startDate} - ${endDate}</p></button>`
    })
    const travelerHTML = `<h2>${traveler.name.toLowerCase()}</h2>
      <p>total spent this year: $${dom.addCommas(traveler.calculateTotalAmountSpent(state.destinations))}</p>
      <div class="search-results">${trips.join('')}</div>
      <p>click on a wandering for expanded details</p>`
    $('.search-output').html(travelerHTML);
  },

  searchAllTravelers(state, e) {
    e.preventDefault();
    const query = $('#traveler-search').val().toLowerCase();
    let traveler = state.currentUser.searchForTraveler(query, state.travelers, state.trips, state.destinations)
    if (traveler instanceof Traveler) {
      state.searchedTraveler = traveler;
      dom.showTravelerSearch(traveler, state);
    } else {
      const noResultsHTML = `<h2>${traveler}</h2>`
      $('.search-output').html(noResultsHTML);
    }
  },

  showCostBreakdown(e) {
    let trip = dom.grabTripDetails(e.data);
    if (trip) {
      trip.userId = e.data.currentUser.id;
      trip = new Trip(trip);
      const breakdown = trip.calculateCostBreakdown(e.data.destinations);
      $('#price').html(`<p>flights: $${dom.addCommas(breakdown.flightCost)}, lodging: $${dom.addCommas(breakdown.lodgingCost)},
        Service Fee: $${dom.addCommas(breakdown.serviceFee)}</p><p>Total: $${dom.addCommas(breakdown.totalCost)}</p>`)
    } else {
      $('#required').text('all fields are required').hide().fadeIn(2000).delay(1000).fadeOut(2000);
    }
  },

  showPendingTrips(state) {
    const user = state.currentUser;
    const pending = sortByDate(user.showPendingTrips(state.trips));
    const pendingCards = pending.map(trip => {
      const destination = state.destinations.find(destination => destination.id === trip.destinationID);
      return dom.makeTripCard(trip, destination);
    })
    $('.current-trips').html(pendingCards.join(''));
  },

  showCurrentTravelers(state) {
    const currentTravelers = state.currentUser.showCurrentTrips(state.trips).length;
    $('.welcome-banner').append(`<h2>current wanderers: ${currentTravelers}</h2>`)
  },

  showTravelDetails(e) {
    let targetID = $(e.target).closest('.trip').attr('id') || $(e.target).closest('.trip-entry').attr('data-id');
    let targetClass = $(e.target).closest('.trip').attr('class');
    targetID = parseInt(targetID);
    const targetTrip = e.data.trips.find(trip => parseInt(trip.id) === targetID);
    const user = e.data.travelers.find(user => parseInt(user.id) === targetTrip.userID);
    const destination = e.data.destinations.find(dest => dest.id === targetTrip.destinationID);
    const cost = targetTrip.calculateCostBreakdown(e.data.destinations);
    const approveBtn = `<button class="btn btn--approve" type="button" name="approve">approve</button>`
    const denyBtn = `<button class="btn btn--deny" type="button" name="deny">deny</button>`
    const hidden = e.data.currentUser instanceof Traveler || targetClass === 'past trip' ? 'hidden' : '';
    const detailsHTML = `
      <button class="btn btn--exit" type="button" name="exit">x</button>
      <h2>${destination.destination.toLowerCase()}</h2>
      <h2 ${hidden}>${user.name.toLowerCase()}</h2>
      <p>duration: ${targetTrip.duration} days</p>
      <p>wanderers: ${targetTrip.travelers}</p>
      <p>status: ${targetTrip.status}</p>
      <p>total cost: $${dom.addCommas(cost.totalCost)}</p>
      <p ${hidden}>agency percentage: $${dom.addCommas(cost.serviceFee)}</p>
      <p id="success-msg"></p>
      <div class="btn-container ${hidden}">
          ${denyBtn}
          ${targetTrip.status === 'approved' ? '' : approveBtn}
      </div>`
    $('.expanded-trip-details').before('<section class="overlay"></section>');
    $('.expanded-trip-details').toggleClass('hidden');
    $('.expanded-trip-details').removeClass('expanded-destination-form');
    $('.expanded-trip-details').attr('id', targetID);
    $('.expanded-trip-details').html(detailsHTML);
    $('.btn--exit').focus();
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
      Promise.all([getData(TRIPS_ENDPOINT)])
        .catch(error => {
          console.log(error.message);
        })
    } else {
      $('#required').text('all fields are required').hide().fadeIn(2000).delay(1000).fadeOut(2000);
    }
  }
}

export default dom;
