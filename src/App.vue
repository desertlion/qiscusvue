<template>
  <login v-if="!isLogin"></login>
  <div id="app" v-if="isLogin">
    <div id="header">
      <div class="qiscus-logo">
        <strong>qis</strong>cus
      </div>
      <div class="header__main">
        <div class="chat-info">{{ room_name }} &raquo; <strong>{{ topic_title }}</strong></div>
        <div class="menus">
          <input type="text" v-model="search">
          <i class="fa fa-bell"></i>
          <i class="fa fa-chevron-down"></i>
          <avatar :src="avatarUrl"></avatar>
        </div>
      </div>
    </div>
    <div id="qiscus-app">
      <rooms-list></rooms-list>
      <topics-list></topics-list>
      <messages-list></messages-list>
    </div>
  </div>
</template>

<script>
import RoomsList from './components/RoomsList';
import TopicsList from './components/TopicsList';
import MessagesList from './components/MessagesList';
import store from './vuex/store';
import Avatar from './components/Avatar';
import Login from './components/Login';
import { isLogin } from './vuex/getters';

export default {
  components: {
    RoomsList, MessagesList, TopicsList, Avatar, Login
  },
  store,
  vuex: {
    getters: {
      isLogin,
      avatarUrl: (state) => state.user.avatar,
      selected: (state) => state.selected
    }
  },
  computed: {
    room_name() {
      return this.selected.room != null ? this.selected.room.name : '';
    },
    topic_title() {
      return this.selected.topic != null ? this.selected.topic.title : '';
    }
  }
}
</script>

<style lang="scss">
@import './assets/monokai-sublime';

*, *:before, *:after {
  box-sizing: border-box;
}
html, body, #app {
  width: 100%; height: 100%; overflow: hidden;
}

body {
  display: flex;
  flex-flow: column nowrap;
}

#qiscus-app {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  height: 100%;
}

#header { position: relative; box-shadow: 0 0 9px rgba(0,0,0,.15); }

.qiscus-logo {
  background: #111518;
  width: 200px; height: 50px;
  text-align: center;
  font-size: 24px;
  padding-top: 8px;
  color: #FFF; position: absolute; top: 0; left: 0;
}
.header__main {
  background: #171d1f;
  color: #eee;
  height: 50px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between; padding-left: 200px; align-items: center;
}
.chat-info { flex: 2; padding: 15px; }
.header__main .menus { display: flex; align-items: center; justify-content: space-around; padding-right: 15px; }
.header__main .menus i { margin: 0 15px; }

#qiscus-app {
  color: #2c3e50;
  font-family: Source Sans Pro, Helvetica, sans-serif;
}

/*.chat-info { color: #444; }*/

a {
  color: #42b983;
  text-decoration: none;
}
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}
</style>
