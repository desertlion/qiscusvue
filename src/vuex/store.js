import Vue from 'vue';
import Vuex from 'vuex';
import lstore from 'store';
Vue.use(Vuex)

const user = lstore.get('qcData');
const userToken = (user) ? true : false;
// the root, initial state object
const state = {
  isLogin: userToken || false,
  isLoggingIn: false,
  user: user || {},
  rooms: [],
  selected: {
    room: null,
    topic: null
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  ///////// LOGIN /////////////
  LOGIN_SUCCESS (state, data) {
    state.isLogin = true;
    state.isLoggingIn = false;
    state.user = data;
  },
  LOGIN_ERROR (state) {
    state.isLogin = false;
    state.isLoggingIn = false;
  },
  ///////////// ROOMS ///////////////
  UPDATE_ROOM(state, rooms) {
    state.rooms = rooms
  },
  SELECT_ROOM(state, room, topic) {
    state.selected.room = room;
    state.selected.topic = topic;
  },
  SELECT_TOPIC(state, selected) {
    state.selected.topic = selected.topic;
  },
  //////////// COMMENTS /////////////////
  SUBMIT_COMMENT(state, rooms) {
    state.rooms = rooms;
  }
}

// create the Vuex instance by combining the state and mutations objects
// then export the Vuex store for use by our components
export default new Vuex.Store({
  state,
  mutations
})
