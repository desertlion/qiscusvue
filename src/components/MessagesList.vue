<template>
  <div class="messages">
    <ul id="messages__comments">
      <li v-for="comment in comments">
        <comment :comment="comment" :onupdate="scrollToBottom"></comment>
      </li>
    </ul>
    <div class="comment-form">
      <textarea placeholder="type your comment here ..." @keyup.enter="postComment($event)" v-model="comment_msg"></textarea>
      <div class="uploader">
        <i class="fa fa-paperclip"></i>
        <input class="uploader__input" name="file" type="file" @change="uploadFile">
      </div>
    </div>
  </div>
</template>

<script>
import Comment from './Comment';
import {submitComment} from '../vuex/actions';

export default {
  components: { Comment },
  vuex: {
    getters: {
      comments: (state) => (state.selected.topic) ? state.selected.topic.comments : [],
      selected_topic_id: (state) => (state.selected.topic) ? state.selected.topic.id : 0,
      user: (state) => state.user
    },
    actions: {
      submitComment
    }
  },
  data () {
    return {
      // uploadUrl: `https://upload.qisc.us/upload.php?username=${this.user.username}&topic_id=${this.selected_topic_id}&hashing=ok`,
      comment_msg: '',
      uploadedFiles: [],
      fileProgress: 0,
      allFilesUploaded: false
    }
  },
  computed: {
    uploadUrl: function(){
      return `https://upload.qisc.us/upload.php?username=${this.user.username}&topic_id=${this.selected_topic_id}&hashing=ok`
    }
  },
  methods: {
    scrollToBottom: function() {
      var element = document.getElementById('messages__comments');
      element.scrollTop = (element.scrollHeight - element.clientHeight) + 7000;
    },
    uploadFile(e) {
      var vm       = this;
      var files    = e.target.files || e.dataTransfer.files;
      var formData = new FormData();
      var reader   = new FileReader();
      formData.append('file', files[0]);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', vm.uploadUrl, true);
      console.info(vm.uploadUrl, vm.selected_topic_id)
      xhr.onload = function() {
        if(xhr.status === 200) {
          // file(s) uploaded), let's post to comment
          console.log('file uploaded', xhr.response);
          var url = JSON.parse(xhr.response).url
          vm.submitComment(vm.selected_topic_id, `[file] ${url} [/file]`);

        }
      }
      xhr.send(formData);

      // reader.onload = (e) => { vm.uploadedFiles.push(e.target.result) };
      // reader.readAsDataURL(files[0]);
    },
    postComment(e) {
      if(!e.shiftKey){
        e.preventDefault();
        e.stopPropagation();
        this.submitComment(this.selected_topic_id, this.comment_msg);
        this.comment_msg = '';
      }
    }
  },
  ready() {
    this.scrollToBottom();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.messages {
  flex: 3;
  box-shadow: inset 3px 0 9px rgba(0,0,0,.5);
  padding: 15px 15px 70px 15px;
  display: flex;
  flex-flow: column nowrap;
}
ul {
  list-style: none;
  margin:0; padding:0;
  overflow-y: auto;
}
.comment-form {
  display: flex;
  flex-flow: row nowrap;
  min-height: 70px;
  i {
    font-size: 24px; margin-left: 15px; color: #444;
    cursor: pointer;
  }
  .uploader {
    flex-basis: 80%;
    flex: 2.5;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    input {
      opacity: 0; width: 100%; height: 100%;
      position: absolute;
      top: 0; left: 0; cursor: pointer;
    }
  }
}
.comment-form textarea {
  width: 100%;
  border-radius: 5px;
  font-size: 12px; padding: 10px;
}
</style>
