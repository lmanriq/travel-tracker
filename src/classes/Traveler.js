import { BASE, TRIPS_ENDPOINT } from '../constants/constants';

import User from './User';
import Trip from './Trip';

class Traveler extends User {
  constructor(user) {
    super(user);
    // this.id = user ? user.id : null;
    // this.name = user ? user.name : null;
    // this.travelerType = user ? user.travelerType : null;
    this.myTrips = localStorage.getItem('myTrips')
      ? JSON.parse(localStorage.getItem('myTrips'))
      : [];
  }

  requestTrip(destinationID, travelers, date, duration) {
    const dateStamp = Date.now();
    const myTrip = {
      userID: this.id,
      destinationID,
      travelers,
      date,
      duration
    }
    const newTrip = new Trip(myTrip);
    this.myTrips.push(newTrip);
    localStorage.setItem('myTrips', JSON.stringify(this.myTrips));
    window
      .fetch(BASE + TRIPS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrip)
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
    const approvedTrips = this.myTrips.filter(trip => trip.status === 'approved');
    const totalSpent = approvedTrips.reduce((cost, trip) => {
      return cost + trip.calculateCostBreakdown(destinationData).totalCost;
    }, 0)
    return totalSpent;
  }
}

export default Traveler;
