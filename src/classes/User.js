import { BASE, TRAVELER_ENDPOINT } from '../constants/constants';

class User {
  constructor(user) {
    this.id = user ? user.id : null;
    this.name = user ? user.name : null;
    this.travelerType = user ? user.travelerType : null;
  }

  logIn(username, password) {
    let valid = true;
    let regex = /traveler(?:[1-9]|[1-4][0-9]|50)$/
    const validPassword = 'travel2020';
    if (regex.test(username) && password === validPassword) {
      this.id = parseInt(username.slice(8));
      window.fetch(BASE + TRAVELER_ENDPOINT + this.id)
        .then(response => response.json())
        .then(data => {
          this.id = data.id;
          this.name = data.name;
          this.travelerType = data.travelerType;
        })
        .catch(error => {
          console.log(error.message)
        })
      // const matchedTraveler = userData.find(user => user.id === this.id);
      // this.name = matchedTraveler.name;
      // this.travelerType = matchedTraveler.travelerType;
      // return 'success'
    } else if (username === 'agency' && password === validPassword) {
      this.id = 0;
      this.name = 'Agent Barbarita Lopez';
      this.travelerType = 'agent';
      // return 'success'
    } else {
      return 'Incorrect username or password. Please try again.'
    }
  }
}

export default User;
