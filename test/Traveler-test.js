import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import { BASE, TRIPS_ENDPOINT } from '../src/constants/constants';
import User from '../src/classes/User';
import Traveler from '../src/classes/Traveler';
import Trip from '../src/classes/Trip';

chai.use(spies);

describe('Traveler', function() {
  let travelerData;
  let traveler;
  let user;

  beforeEach(function() {
    travelerData = sampleTravelers.travelers;
    const sampleUser = {
      id: 1,
      name: 'Ham Leadbeater',
      travelerType: 'relaxer'
    }
    user = new User(sampleUser);
    traveler = new Traveler(user);
    global.window;
    global.localStorage;
    chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
    chai.spy.on(localStorage, ['getItem', 'setItem'], () => {});
  });

  afterEach(function() {
    chai.spy.restore();
  });

  it('should be a function', function() {
    expect(Traveler).to.be.a('function');
  });

  it('should be an instance of User', function() {
    expect(traveler).to.be.an.instanceof(Traveler);
  });

  it('should instantiate with an id', function() {
    expect(traveler.id).to.eq(1);
  });

  it('should instantiate without a name', function() {
    expect(traveler.name).to.eq('Ham Leadbeater');
  });

  it('should instantiate without a traveler type', function() {
    expect(traveler.travelerType).to.eq('relaxer');
  });

  it('should instantiate without trips', function() {
    expect(traveler.myTrips).to.deep.eq([]);
  });

  describe('request trips', function() {
    let newTrip;

    beforeEach(function() {
      traveler.requestTrip(2, 5, '2021/12/15', 5);
      newTrip = new Trip (traveler.id, 2, 5, '2021/12/15', 5);
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

    it('should save its trips to local storage', function() {
      expect(localStorage.setItem).to.be.called(1);
      expect(localStorage.setItem).to.be.called.with('myTrips', JSON.stringify(newTrip));
    });
  });
});
