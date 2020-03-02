import { BASE, TRIPS_ENDPOINT } from '../constants/constants';

import User from './User';
import Trip from './Trip';
import moment from 'moment';
moment().format();

class Traveler extends User {
  constructor(user, tripData) {
    super(user);
    this.myTrips = tripData.filter(trip => trip.userID === this.id);
  }

  requestTrip(destinationID, travelers, date, duration) {
    const dateStamp = Date.now();
    destinationID = parseInt(destinationID);
    travelers = parseInt(travelers);
    const myTrip = {
      id: dateStamp,
      userID: this.id,
      destinationID,
      travelers,
      date,
      duration,
      status: 'pending',
      suggestedActivities: []
    }
    const newTrip = new Trip(myTrip);
    this.myTrips.push(newTrip);
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
    return totalSpent;
  }
}

export default Traveler;
