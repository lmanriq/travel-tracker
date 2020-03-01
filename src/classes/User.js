import { BASE, TRAVELER_ENDPOINT } from '../constants/constants';
import moment from 'moment';
moment().format();

class User {
  constructor(user) {
    this.id = user ? user.id : null;
    this.name = user ? user.name : null;
    this.travelerType = user ? user.travelerType : null;
  }

  logIn(username, password) {
    let valid = true;
    let regex = /^traveler(?:[1-9]|[1-4][0-9]|50)$/
    const validPassword = 'travel2020';
    if (regex.test(username) && password === validPassword) {
      this.id = parseInt(username.slice(8));
      return this.id;
    } else if (username === 'agency' && password === validPassword) {
      this.id = 0;
      this.name = 'Agent Barbarita Lopez';
      this.travelerType = 'agent';
      return this.id;
    } else {
      return 'Incorrect username or password. Please try again.'
    }
  }

  showPendingTrips(trips) {
    const pendingTrips = trips.filter(trip => trip.status === 'pending');
    return pendingTrips;
  }

  showPastTrips(trips) {
    const pastTrips = trips.filter(trip => {
      const startDate = new Date (trip.date);
      const endDate = new Date(moment(startDate).add(trip.duration, 'days').calendar());
      return endDate < new Date();
    })
    return pastTrips;
  }

  showCurrentTrips(trips) {
    const currentTrips = trips.filter(trip => {
      const startDate = new Date(trip.date);
      const endDate = new Date(moment(startDate).add(trip.duration, 'days').calendar());
      const today = new Date();
      return startDate < today && today < endDate;
    }).sort((a, b) => a[new Date(a.date)] - b[new Date(a.date)])
    return currentTrips;
  }

  showFutureTrips(trips) {
    const futureTrips = trips.filter(trip => {
      const startDate = new Date (trip.date);
      return startDate > new Date();
    });
    return futureTrips;
  }
}

export default User;
