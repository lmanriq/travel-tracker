import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import sampleTrips from '../src/sample-data/sample-trip-data';
import sampleDestinations from '../src/sample-data/sample-destination-data';
import { BASE, TRIPS_MODIFICATION_ENDPOINT } from '../src/constants/constants';
import TravelAgency from '../src/classes/TravelAgency';
import Trip from '../src/classes/Trip';

// import sampleTravelers from '../data/sample-traveler-data';

describe('TravelAgency', function() {
  let agent;
  let tripData;
  let travelerData;
  let destinationData;
  let trip;

  beforeEach(function() {
    global.window = {};
    // trip = new Trip({
    //   "id": 5,
    //   "userID": 42,
    //   "destinationID": 29,
    //   "travelers": 3,
    //   "date": "2020/04/30",
    //   "duration": 18,
    //   "status": "approved",
    //   "suggestedActivities": []
    // });
    chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
    // chai.spy.on(trip, 'delete', () => {});
    tripData = sampleTrips.trips;
    travelerData = sampleTravelers.travelers;
    destinationData = sampleDestinations.destinations;
    let barbarita = {
      id: 0,
      name: 'Agent Barbarita Lopez',
      travelerType: 'agent'
    };
    agent = new TravelAgency(barbarita);
  });

  afterEach(function() {
    chai.spy.restore();
  });

  it('should be a function', function() {
    expect(TravelAgency).to.be.a('function');
  });

  it('should be an instance of TravelAgency', function() {
    expect(agent).to.be.an.instanceof(TravelAgency);
  });

  it('should have an id of 0', function() {
    expect(agent.id).to.eq(0);
  });

  it('should have a name', function() {
    expect(agent.name).to.eq('Agent Barbarita Lopez');
  });

  it('should be an agent as traveler type', function() {
    expect(agent.travelerType).to.eq('agent');
  });

  it('should be able to approve trip requests', function() {
    agent.approveRequest(5)
    const update = {
      id: 5,
      status: 'approved'
    }
    expect(window.fetch).to.be.called(1);
    expect(window.fetch).to.be.called.with(BASE + TRIPS_MODIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(update)
    });
  });

  // it('should be able to deny trip requests', function() {
  //   agent.denyRequest(5, tripData);
  //   expect(trip.delete).to.be.called(1);
  // });

  it('should be able to search for travelers', function() {
    expect(agent.searchForTraveler('Ham Leadbeater', travelerData, tripData, destinationData)).to.deep.eq({
      id: 1,
      name: 'Ham Leadbeater',
      travelerType: 'relaxer',
      myTrips: [
        {
          id: 117,
          userID: 1,
          destinationID: 5,
          travelers: 3,
          date: '2021/01/09',
          duration: 15,
          status: 'approved',
          suggestedActivities: []
        }
      ]
    });
  });

  it('should get an error message if no user exists', function() {
    expect(agent.searchForTraveler('Dork Dorkleton', travelerData, tripData, destinationData)).to.eq('User not found');
  });
});
