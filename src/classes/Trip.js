class Trip {
  constructor(userID, destinationID, numTravelers, date, duration) {
    this.id = Date.now();
    this.userID = userID;
    this.destinationID = destinationID;
    this.travelers = numTravelers;
    // <string 'YYYY/MM/DD'>
    this.date = date;
    this.duration = duration;
    this.status = 'pending';
    this.suggestedActivities = []
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
