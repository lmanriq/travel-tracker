class Traveler {
  constructor() {
    this.id = null;
    this.name = null;
    this.travelerType = null;
  }

  logIn(username, password, userData) {
    let valid = true;
    let regex = /customer(?:[1-9]|[1-4][0-9]|50)$/
    const validPassword = 'travel2020';
    if (regex.test(username) && password === validPassword) {
      this.id = parseInt(username.slice(7));
      const matchedTraveler = userData.find(user => user.id === this.id);
      this.name = matchedTraveler.name;
      this.travelerType = matchedTraveler.travelerType;
      return 'success'
    } else if (username === 'agency' && password === validPassword) {
      this.id = 0;
      this.name = 'Agent Lopez';
      this.travelerType = 'manager';
      return 'success'
    } else {
      return 'Incorrect username or password. Please try again.'
    }
  }
}

export default Traveler;
