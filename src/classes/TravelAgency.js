import User from '../classes/User';

class TravelAgency extends User {
  constructor(user) {
    super(user);
  }

  approveRequest() {

  }

  denyRequest() {
    //Send the delete request
  }
}


export default TravelAgency;
