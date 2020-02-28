import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTrips from '../src/sample-data/sample-trip-data';
import sampleDestinations from '../src/sample-data/sample-destination-data';
import { BASE, TRIPS_ENDPOINT } from '../src/constants/constants';
import User from '../src/classes/User';
import Trip from '../src/classes/Trip';


describe('Trip', function() {
  let tripData;
  let trip;
  let newTrip;
  let destinationData;

  beforeEach(function() {
    global.window = {};
    chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
    tripData = sampleTrips.trips;
    destinationData = sampleDestinations.destinations;
    trip = new Trip(tripData[0])
    let myTrip = {
      userID: 1,
      destinationID: 2,
      travelers: 5,
      date: '2021/12/15',
      duration: 5
    }
    newTrip = new Trip(myTrip)
  });

  afterEach(function() {
    chai.spy.restore();
  });

  it('should be a function', function() {
    expect(Trip).to.be.a('function');
  });

  it('should be an instance of Trip', function() {
    expect(trip).to.be.an.instanceof(Trip);
  });

  it('should instantiate with an id if it already has one', function() {
    expect(trip.id).to.eq(1);
  });

  it(`should instantiate with a date stamp id if it doesn't have an id`, function() {
    expect(newTrip.id).to.eq(Date.now());
  });

  it('should instantiate with a user ID', function() {
    expect(trip.userID).to.eq(2);
  });

  it('should instantiate with a destinationID', function() {
    expect(trip.destinationID).to.eq(10);
  });

  it('should instantiate with a number of travelers', function() {
    expect(trip.travelers).to.eq(1);
  });

  it('should instantiate with a date', function() {
    expect(trip.date).to.eq('2019/09/16');
  });

  it('should instantiate with a duration', function() {
    expect(trip.duration).to.eq(8);
  });

  it('should instantiate with a status if it has one', function() {
    expect(trip.status).to.eq('approved');
  });

  it('should instantiate with a default status of pending', function() {
    expect(newTrip.status).to.eq('pending');
  });

  it('should instantiate with suggested activities', function() {
    expect(trip.suggestedActivities).to.deep.eq([]);
  });

  it('should instantiate with an empty array of suggested activities by default', function() {
    expect(newTrip.suggestedActivities).to.deep.eq([]);
  });

  it('should be able to get details about a destination', function() {
    expect(trip.getDestinationDetails(destinationData)).to.deep.eq({
      destination: "Toronto, Canada",
      estimatedFlightCostPerPerson: 450,
      estimatedLodgingCostPerDay: 90,
      id: 10,
      image: `https://images.unsplash.com/photo-1535776142635-8fa180c46af7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2756&q=80`
    });
  });

  it('should be able to provide an estimated cost breakdown', function() {
    expect(trip.calculateCostBreakdown(destinationData)).to.deep.eq({
      flightCost: 450,
      lodgingCost: 720,
      serviceFee: 117,
      totalCost: 1287
    });
  });

  it('should be able to delete itself', function() {
    trip.delete();
    expect(window.fetch).to.be.called(1);
    expect(window.fetch).to.be.called.with(BASE + TRIPS_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: trip.id})
    });
  });
});
