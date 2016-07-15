<template>
  <div class="rooms-list">
    <div class="rooms-list__header">
      <h3>Rooms</h3>
      <i class="fa fa-plus"></i>
    </div>
    <ul>
      <li v-for="room in rooms"
        :class="{'selected': selected.room.id == room.id}"
        @click="selectRoom(room.id)">
        <img :src="room.avatar" />
        {{ room.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { loadRooms, selectRoom } from '../vuex/actions';
export default {
  vuex: {
    getters: {
      rooms: (state) => state.rooms,
      selected: (state) => state.selected
    },
    actions: {
      loadRooms,
      selectRoom
    }
  },
  ready() {
    this.loadRooms();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.rooms-list {
  background: #171d1f;
  width: 200px;
  box-shadow: 0 3px 17px rgba(0,0,0,.5);
  overflow: auto;
  &__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 13px;
    background: #71cd9d; color: #eee;
    text-shadow: 0 -1px 0 rgba(0,0,0,.3);
  }
  &__header h3 {
    margin: 0; font-size: 14px;
  }
  ul {
    list-style: none; margin: 0; padding: 0;
  }
  li {
    padding: 15px; font-size: 12px;
    color: #ddd;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    transition: all 0.32s ease;
  }
  li img {
    width: 30px; height: 30px; border-radius: 50%; margin-right: 15px;
    border: 2px solid #ccc;
  }
  li.selected, li:hover {
    background: lighten(#171d1f, 10);
    box-shadow: inset 3px 3px 15px rgba(0,0,0,.5);
  }
}
</style>
