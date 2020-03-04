import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import sampleTrips from '../src/sample-data/sample-trip-data';
import sampleDestinations from '../src/sample-data/sample-destination-data';
import { BASE, DESTINATIONS_ENDPOINT, TRIPS_MODIFICATION_ENDPOINT } from '../src/constants/constants';
import TravelAgency from '../src/classes/TravelAgency';
import Trip from '../src/classes/Trip';

describe('TravelAgency', function() {
  let agent;
  let tripData;
  let travelerData;
  let destinationData;
  let trip;

  beforeEach(function() {
    global.window = {};
    chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
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

  it('should be able to add new destinations', function() {
    agent.addNewDestination('Aruba', 555, 222, "https://images.unsplash.com/photo-1558117338-aa433feb1c62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80", "A boat at a pier on clear water", 55);
    const newDestination = {
      id: 55,
      destination: 'Aruba',
      estimatedLodgingCostPerDay: 555,
      estimatedFlightCostPerPerson: 222,
      image: "https://images.unsplash.com/photo-1558117338-aa433feb1c62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80",
      alt: "A boat at a pier on clear water"
    }
    expect(window.fetch).to.be.called(1);
    expect(window.fetch).to.be.called.with(BASE + DESTINATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDestination)
    });
  });

  it('should not be able to post a new destination with falsy values', function() {
    expect(agent.addNewDestination('Aruba', 555, 222, null, "A boat at a pier on clear water", 55)).to.eq('all inputs are required')
  })

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

  it('should be able to deny trip requests', function() {
    expect(agent.denyRequest(5, tripData)).to.be.an.instanceof(Promise);
  });

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
        },
        {
          id: 120,
          userID: 1,
          destinationID: 3,
          travelers: 2,
          date: '2019/01/09',
          duration: 5,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 121,
          userID: 1,
          destinationID: 9,
          travelers: 3,
          date: '2020/02/27',
          duration: 9,
          status: 'approved',
          suggestedActivities: []
        }
      ]
    });
  });

  it('should get an error message if no user exists', function() {
    expect(agent.searchForTraveler('Dork Dorkleton', travelerData, tripData, destinationData)).to.eq('no wanderers found by that name');
  });

  it('should be able to calculate the total revenue for the year', function() {
    expect(agent.calculateTotalRevenue(travelerData, destinationData, tripData)).to.eq(6370.1);
  });
});
