import { BASE, TRIPS_MODIFICATION_ENDPOINT } from '../constants/constants';
import User from '../classes/User';
import Trip from '../classes/Trip';
import Traveler from '../classes/Traveler';

class TravelAgency extends User {
  constructor(user) {
    super(user);
    // this.id = user ? user.id : null;
    // this.name = user ? user.name : null;
    // this.travelerType = user ? user.travelerType : null;
  }

  approveRequest(tripID) {
    const update = {
      id: tripID,
      status: 'approved'
    }
    window
      .fetch(BASE + TRIPS_MODIFICATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
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

  denyRequest(tripID, tripData) {
    const targetTrip = new Trip(tripData.find(trip => trip.id === tripID));
    targetTrip.delete();
  }

  searchForTraveler(travelerName, travelerData, tripData, destinationData) {
    let targetTraveler = travelerData.find(traveler => traveler.name === travelerName);
    if (targetTraveler) {
      targetTraveler = new Traveler(targetTraveler, tripData);
      return targetTraveler;
    } else {
      return 'User not found'
    }
  }

  calculateTotalRevenue(travelerData, destinationData, tripData) {
    const allTravelers = travelerData.map(traveler => new Traveler(traveler, tripData));
    const total = allTravelers.reduce((total, traveler) => {
      return total + traveler.calculateTotalAmountSpent(destinationData);
    }, 0);
    return total * .1;
  }
}


export default TravelAgency;
