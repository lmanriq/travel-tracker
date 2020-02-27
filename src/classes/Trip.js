class Trip {
  constructor(trip) {
    this.id = trip.id || Date.now();
    this.userID = trip.userID;
    this.destinationID = trip.destinationID;
    this.travelers = trip.travelers;
    // <string 'YYYY/MM/DD'>
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

  }

  sortByStatus() {

  }
}

export default Trip;
