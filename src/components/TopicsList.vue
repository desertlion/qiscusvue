<template>
  <div class="topics">
    <ul>
      <li v-for="topic in topics"
        @click="selectTopic(topic.id)"
        :class="{ 'selected': selected.topic.id == topic.id }">
        <i class="fa fa-comments"></i> {{ topic.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import {selectTopic} from '../vuex/actions';

export default {
  vuex: {
    getters: {
      topics: (state) => state.selected.room.topics,
      selected: (state) => state.selected
    },
    actions: {
      selectTopic
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.topics {
  width: 200px;
  background: lighten(#171d1f, 10);
  color: #ccc;
  box-shadow: inset 3px 0 17px rgba(0,0,0,.5);
  overflow: auto;
}
ul {
  font-size: 12px;
  list-style: none; margin: 0; padding: 0;
  li {
    padding: 15px; cursor: pointer; transition: all 0.32s ease;
  }
  li.selected, li:hover {
    background: lighten(#171d1f, 30);
    color: #ccc;
  }
}
</style>
