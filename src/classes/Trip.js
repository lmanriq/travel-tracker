import { BASE, TRIPS_ENDPOINT } from '../constants/constants';

class Trip {
  constructor(trip) {
    this.id = trip.id || Date.now();
    this.userID = trip.userID || trip.userId;
    this.destinationID = trip.destinationID || trip.destinationId;
    this.travelers = trip.travelers;
    this.date = trip.date;
    this.duration = trip.duration;
    this.status = trip.status || 'pending';
    this.suggestedActivities = trip.suggestedActivities || []
  }

  getDestinationDetails(destinationData) {
    return destinationData.find(destination => destination.id === this.destinationID);
  }

  calculateCostBreakdown(destinationData) {
    const destination = this.getDestinationDetails(destinationData);
    const flightCost = this.travelers * destination.estimatedFlightCostPerPerson;
    const lodgingCost = this.travelers * this.duration * destination.estimatedLodgingCostPerDay;
    const serviceFee = (flightCost + lodgingCost) * .1;
    const totalCost = flightCost + lodgingCost + serviceFee;
    return {
      flightCost,
      lodgingCost,
      serviceFee,
      totalCost
    }
  }

  delete() {
    return window
      .fetch(BASE + TRIPS_ENDPOINT, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: this.id})
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
}

export default Trip;
