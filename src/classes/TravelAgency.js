import User from './User';

class TravelAgency extends User {
  constructor(user) {
    super(user);
    // this.id = user ? user.id : null;
    // this.name = user ? user.name : null;
    // this.travelerType = user ? user.travelerType : null;
  }

  approveRequest() {

  }

  denyRequest() {
    //Send the delete request
  }
}


export default TravelAgency;
