import User from '../classes/User';

class Traveler extends User {
  constructor(user) {
    super(user)
    this.myTrips = [];
    this.amountSpent = 0;
  }

  requestTrip(destinationID, numTravelers, date, duration) {
    const dateStamp = Date.now();
    const newTrip = {
      id: dateStamp,
      userID: this.id,
      destinationId: destinationID,
      travelers: numTravelers,
      // <string 'YYYY/MM/DD'>
      date: date,
      duration: duration,
      status: 'pending',
      suggestedActivities: <array of strings>
    }
    this.myTrips.push(newTrip);
  }

  chargeTrip() {

  }

  
}

export default Traveler;
