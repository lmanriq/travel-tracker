import { BASE, TRIPS_ENDPOINT } from '../constants/constants';

import User from '../classes/User';

class Traveler extends User {
  constructor(user) {
    super(user)
    this.myTrips = [];
    this.amountSpent = 0;
  }

  requestTrip(destinationID, numTravelers, date, duration) {
    const dateStamp = Date.now();
    const newTrip = new Trip(this.id, destinationID, numTravelers, date, duration);
    this.myTrips.push(newTrip);
    window
      .fetch(BASE + TRIPS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrip)
      })
      .then(response => response.json())
      .then(data => data)
      .catch(error => {
        throw error
      }
    )
  }

  calculateTotalAmountSpent(destinationData) {
    const approvedTrips = this.myTrips.filter(trip => trip.status === 'approved');
    const totalCost = approvedTrips.reduce((cost, trip) => {
      return cost + trip.calculateCostBreakdown(destinationData).totalCost;
    }, 0)
    return totalCost;
  }
}

export default Traveler;
