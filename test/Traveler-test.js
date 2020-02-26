import chai from 'chai';
const expect = chai.expect;
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import Traveler from '../src/classes/Traveler';

describe('Traveler', function() {
  let travelerData;
  let traveler;
  //
  // {
  //   "id": 1,
  //   "name": "Ham Leadbeater",
  //   "travelerType": "relaxer"
  // },

  beforeEach(function() {
    travelerData = sampleTravelers.travelers;
    traveler = new Traveler(travelerData[0]);
  });

  it('should be a function', function() {
    expect(Traveler).to.be.a('function');
  });

  it('should be an instance of User', function() {
    expect(traveler).to.be.an.instanceof(Traveler);
  });

  it('should instantiate without an id', function() {
    expect(traveler.id).to.eq(null);
  });

  it('should instantiate without a name', function() {
    expect(traveler.name).to.eq(null);
  });

  it('should instantiate without a traveler type', function() {
    expect(traveler.travelerType).to.eq(null);
  });

  it('should instantiate without trips', function() {
    expect(traveler.myTrips).to.deep.eq([]);
  });

  it('should instantiate without money spent', function() {
    expect(traveler.amountSpent).to.eq(0);
  });

  describe('logging in', function() {
    it('should be able to log in', function() {
      expect(traveler.logIn('traveler1', 'travel2020', travelerData)).to.eq('success');
    });

    it('should not be able to log in with an incorrect username', function() {
      expect(traveler.logIn('travel1', 'travel2020', travelerData)).to.eq('Incorrect username or password. Please try again.');
    });

    it('should not be able to log in with an incorrect password', function() {
      expect(traveler.logIn('traveler1', 'travel2021', travelerData)).to.eq('Incorrect username or password. Please try again.');
    });

    it('should have an ID after logging in', function() {
      traveler.logIn('traveler1', 'travel2020', travelerData)
      expect(traveler.id).to.eq(1);
    });

    it('should initialize without a name', function() {
      traveler.logIn('traveler1', 'travel2020', travelerData)
      expect(traveler.name).to.eq('Ham Leadbeater');
    });

    it('should initialize without a traveler type', function() {
      traveler.logIn('traveler1', 'travel2020', travelerData)
      expect(traveler.travelerType).to.eq('relaxer');
    });
  });
});
