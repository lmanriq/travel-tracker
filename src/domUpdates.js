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
  },

  bindTravelerBtns(state) {
    dom.bindUniversalBtns(state);
    $('.btn--submit').on('click', null, state, dom.submitTripRequest);
    $('.btn--price').on('click', null, state, dom.showCostBreakdown);
  },

  bindAgentBtns(state) {
    dom.bindUniversalBtns(state);
    $('.trip-form').on('click', 'li', state, dom.showTravelDetails);
    $('.expanded-trip-details').on('click', '.btn--approve', state, dom.approvePendingTrip);
    $('.expanded-trip-details').on('click', '.btn--deny', state, dom.denyPendingTrip);
    $('.btn--search').on('click keyup', function(e) {
      dom.searchAllTravelers(state, e);
    });
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
      <button class="btn btn--search" type="button" name="search">search</button>
      <div class="search-output"></div>`
    $('.trip-form').html(searchForm);
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
        console.log(e.data.currentUser)
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
    } else {
      const nextTrip = futureTrips[0];
      const destination = state.destinations.find(dest => dest.id === nextTrip.destinationID);
      const travelDate = moment(nextTrip.date, 'YYYY/MM/DD').unix();
      const today = moment().unix();
      const diff = travelDate - today;
      dom.showCountdownClock(diff, destination);
    }
  },

  showTravelerSearch(traveler, state) {
    let trips = traveler.myTrips.map(trip => {
      const dest = state.destinations.find(dest => dest.id === trip.destinationID);
      const startDate = moment(trip.date).format('l');
      let endDate = moment(trip.date).add(trip.duration, 'days').calendar();
      endDate = moment(endDate).format('l');
      return `<li class="${trip.id}">${dest.destination} (${trip.status})<p>${startDate} - ${endDate}</p></li>`
    })
    const travelerHTML = `<h2>${traveler.name.toLowerCase()}</h2>
      <p>total spent this year: $${dom.addCommas(traveler.calculateTotalAmountSpent(state.destinations))}</p>
      <ul>${trips.join('')}</ul>
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
    let targetID = $(e.target).closest('.trip').attr('id') || $(e.target).closest('li').attr('class');
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
      <h2>${user.name.toLowerCase()}</h2>
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
