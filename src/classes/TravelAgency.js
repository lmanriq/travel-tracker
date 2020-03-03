import { BASE, DESTINATIONS_ENDPOINT, TRIPS_MODIFICATION_ENDPOINT } from '../constants/constants';
import User from '../classes/User';
import Trip from '../classes/Trip';
import Traveler from '../classes/Traveler';

class TravelAgency extends User {
  constructor(user) {
    super(user);
  }

  addNewDestination(destination, lodgingCost, flightCost, url, alt, id) {
    const newDestination = {
      id: parseInt(id) || new Date(),
      destination: destination,
      estimatedLodgingCostPerDay: parseInt(lodgingCost),
      estimatedFlightCostPerPerson: parseInt(flightCost),
      image: url,
      alt: alt
    }
    window.fetch(BASE + DESTINATIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDestination)
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

  approveRequest(tripID) {
    const update = {
      id: tripID,
      status: 'approved'
    }
    window.fetch(BASE + TRIPS_MODIFICATION_ENDPOINT, {
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
    return targetTrip.delete();
  }

  searchForTraveler(query, travelerData, tripData, destinationData) {
    query = query.toLowerCase();
    let targetTraveler = travelerData.find(traveler => traveler.name.toLowerCase().includes(query));
    if (targetTraveler) {
      targetTraveler = new Traveler(targetTraveler, tripData);
      return targetTraveler;
    } else {
      return 'no wanderers found by that name'
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
