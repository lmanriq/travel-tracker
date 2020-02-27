import $ from 'jquery';
import Traveler from './classes/Traveler';
import TravelAgency from './classes/TravelAgency';
import { BASE, TRAVELER_ENDPOINT } from './constants/constants';
import {
  getUserInfo
} from './index';


const dom = {
  bindLoginButton(state) {
    $('.btn--login').on('click', null, state, getUserInfo)
  },

  bindEvents(state) {
    // $('.btn--login').on('click', null, state, dom.loginUser)
  },

  loadDashboard(state) {
    $('.login-header').text(state.currentUser.name);
  },

  loadLogin() {
    $('.login-header').hide().fadeIn(3000);
  },

  loginUser() {
    const username = $('#username-input').val();
    const password = $('#password-input').val();
    return {
      username,
      password
    }
  }
}

export default dom;
