import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleDestinations from '../src/sample-data/sample-destination-data';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import sampleTrips from '../src/sample-data/sample-trip-data';
import { BASE, TRIPS_ENDPOINT } from '../src/constants/constants';
import User from '../src/classes/User';
import Traveler from '../src/classes/Traveler';
import Trip from '../src/classes/Trip';
import moment from 'moment';
moment().format();

chai.use(spies);

describe('Traveler', function() {
  let traveler;
  let destinationData;
  let travelerData;
  let tripData;
  let user;

  beforeEach(function() {
    global.window = {};
    chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
    destinationData = sampleDestinations.destinations;
    travelerData = sampleTravelers.travelers;
    tripData = sampleTrips.trips;
    const sampleUser = {
      id: 1,
      name: 'Ham Leadbeater',
      travelerType: 'relaxer'
    }
    user = new User(sampleUser);
    traveler = new Traveler(user, tripData);
  });

  afterEach(function() {
    chai.spy.restore();
  });

  it('should be a function', function() {
    expect(Traveler).to.be.a('function');
  });

  it('should be an instance of Traveler', function() {
    expect(traveler).to.be.an.instanceof(Traveler);
  });

  it('should instantiate with an id', function() {
    expect(traveler.id).to.eq(1);
  });

  it('should instantiate with a name', function() {
    expect(traveler.name).to.eq('Ham Leadbeater');
  });

  it('should instantiate with a traveler type', function() {
    expect(traveler.travelerType).to.eq('relaxer');
  });

  it('should instantiate with its trips', function() {
    expect(traveler.myTrips).to.deep.eq([
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
    ]);
  });

  describe('request trips', function() {
    let newTrip;

    beforeEach(function() {
      traveler.requestTrip(2, 5, '2021/12/15', 5);
      let myTrip = {
        userID: traveler.id,
        destinationID: 2,
        travelers: 5,
        date: '2021/12/15',
        duration: 5
      }
      newTrip = new Trip(myTrip);
    });

    it('should send trip requests to the server', function() {
      expect(window.fetch).to.be.called(1);
      expect(window.fetch).to.be.called.with(BASE + TRIPS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrip)
      })
    });
  });

  it('should be able to calculate the total amount spent on trips', function() {
    expect(traveler.calculateTotalAmountSpent(destinationData)).to.eq(19195)
  });
});
