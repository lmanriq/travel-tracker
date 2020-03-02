import chai, { expect } from 'chai';
import spies from 'chai-spies';
import sampleTravelers from '../src/sample-data/sample-traveler-data';
import sampleTrips from '../src/sample-data/sample-trip-data';
import User from '../src/classes/User';
import moment from 'moment';
moment().format();

// chai.use(spies);

describe('User', function() {
  let travelerData;
  let user;
  let tripData;
  // global.window = {};

  beforeEach(function() {
    travelerData = sampleTravelers.travelers;
    user = new User();
    tripData = sampleTrips.trips;
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

  describe('sort trips', function() {
    it('should be able to show its past trips', function() {
      expect(user.showPastTrips(tripData)).to.deep.eq([
        {
          id: 1,
          userID: 2,
          destinationID: 10,
          travelers: 1,
          date: '2019/09/16',
          duration: 8,
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
          id: 9,
          userID: 24,
          destinationID: 7,
          travelers: 5,
          date: '2019/12/19',
          duration: 19,
          status: 'approved',
          suggestedActivities: []
        }
      ]);
    });

    it('should be able to show its current trips', function() {
      expect(user.showCurrentTrips(tripData)).to.deep.eq([]);
    });

    it('should be able to show its future trips', function() {
      expect(user.showFutureTrips(tripData)).to.deep.eq([
        {
          id: 2,
          userID: 4,
          destinationID: 9,
          travelers: 5,
          date: '2020/10/04',
          duration: 18,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 3,
          userID: 3,
          destinationID: 8,
          travelers: 4,
          date: '2020/05/22',
          duration: 17,
          status: 'pending',
          suggestedActivities: []
        },
        {
          id: 5,
          userID: 5,
          destinationID: 3,
          travelers: 3,
          date: '2020/04/30',
          duration: 18,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 6,
          userID: 7,
          destinationID: 2,
          travelers: 3,
          date: '2020/06/29',
          duration: 9,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 7,
          userID: 8,
          destinationID: 1,
          travelers: 5,
          date: '2020/5/28',
          duration: 20,
          status: 'approved',
          suggestedActivities: []
        },
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
          id: 8,
          userID: 9,
          destinationID: 6,
          travelers: 6,
          date: '2021/02/07',
          duration: 4,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 10,
          userID: 9,
          destinationID: 8,
          travelers: 6,
          date: '2020/07/23',
          duration: 17,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 11,
          userID: 10,
          destinationID: 9,
          travelers: 4,
          date: '2020/10/14',
          duration: 4,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 12,
          userID: 33,
          destinationID: 10,
          travelers: 6,
          date: '2020/10/17',
          duration: 6,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 13,
          userID: 14,
          destinationID: 28,
          travelers: 1,
          date: '2021/02/12',
          duration: 11,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 14,
          userID: 19,
          destinationID: 49,
          travelers: 1,
          date: '2020/09/24',
          duration: 10,
          status: 'approved',
          suggestedActivities: []
        },
        {
          id: 15,
          userID: 50,
          destinationID: 10,
          travelers: 3,
          date: '2020/07/04',
          duration: 6,
          status: 'approved',
          suggestedActivities: []
        }
      ]);
    });
  })
});
