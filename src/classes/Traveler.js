import { BASE, TRIPS_ENDPOINT } from '../constants/constants';

import User from './User';
import Trip from './Trip';
import moment from 'moment';
moment().format();

class Traveler extends User {
  constructor(user, tripData) {
    super(user);
    // this.id = user ? user.id : null;
    // this.name = user ? user.name : null;
    // this.travelerType = user ? user.travelerType : null;
    this.myTrips = tripData.filter(trip => trip.userID === this.id);
  }

  requestTrip(destinationId, travelers, date, duration) {
    const dateStamp = Date.now();
    destinationId = parseInt(destinationId);
    travelers = parseInt(travelers);
    const myTrip = {
      id: dateStamp,
      userId: this.id,
      destinationId,
      travelers,
      date,
      duration,
      status: 'pending',
      suggestedActivities: []
    }
    const newTrip = new Trip(myTrip);
    this.myTrips.push(newTrip);
    // localStorage.setItem('myTrips', JSON.stringify(this.myTrips));
    return window
      .fetch(BASE + TRIPS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(myTrip)
      })
      .then(response => {
        console.log(response.status)
        return response.json()
      })
      .then(data => data)
      .catch(error => {
        throw error
      }
    )
  }

  calculateTotalAmountSpent(destinationData) {
    const approvedTrips = this.myTrips.filter(trip => {
      return trip.status === 'approved' && trip.date.includes(moment().format('YYYY'));
    });
    const totalSpent = approvedTrips.reduce((cost, trip) => {
      trip = new Trip(trip);
      return cost + trip.calculateCostBreakdown(destinationData).totalCost;
    }, 0)
    return totalSpent.toFixed(2);
  }
}

export default Traveler;
