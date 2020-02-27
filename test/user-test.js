import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import User from '../src/classes/User';

// chai.use(spies);

describe('User', function() {
  let travelerData;
  let user;
  // global.window = {};

  beforeEach(function() {
    travelerData = sampleTravelers.travelers;
    user = new User();
    // chai.spy.on(window, 'fetch', () => new Promise((resolve, reject) => {}));
  });

  afterEach(function() {
    // chai.spy.restore();
  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be an instance of User', function() {
    expect(user).to.be.an.instanceof(User);
  });

  it('should instantiate without an id', function() {
    expect(user.id).to.eq(null);
  });

  it('should instantiate without a name', function() {
    expect(user.name).to.eq(null);
  });

  it('should instantiate without a traveler type', function() {
    expect(user.travelerType).to.eq(null);
  });

  describe('logging in', function() {
    it('should be able to log in (traveler)', function() {
      expect(user.logIn('traveler1', 'travel2020')).to.eq(1);
      // expect(window.fetch).to.be.called(1);
      // expect(window.fetch).to.be.called.with('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/1')
    });

    it('should be able to log in (agency)', function() {
      user.logIn('agency', 'travel2020');
      expect(user.id).to.eq(0);
      expect(user.name).to.eq('Agent Barbarita Lopez');
      expect(user.travelerType).to.eq('agent');
    });

    it('should not be able to log in with an incorrect username', function() {
      expect(user.logIn('travel1', 'travel2020', travelerData)).to.eq('Incorrect username or password. Please try again.');
    });

    it('should not be able to log in with an incorrect password', function() {
      expect(user.logIn('traveler1', 'travel2021', travelerData)).to.eq('Incorrect username or password. Please try again.');
    });
  });
});
