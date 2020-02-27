import chai, { expect } from 'chai';
// import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import sampleTrips from '../src/sample-data/sample-trip-data';
import { BASE, TRIPS_ENDPOINT } from '../src/constants/constants';
import User from '../src/classes/User';
import Trip from '../src/classes/Trip';


describe('Trip', function() {
  let tripData;
  let trip;
  let newTrip;

  beforeEach(function() {
    tripData = sampleTrips.trips;
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
    expect(trip.userID).to.eq(44);
  });

  it('should instantiate with a destinationID', function() {
    expect(trip.destinationID).to.eq(49);
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
});
