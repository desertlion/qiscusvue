<template>
  <div class="comment">
    <avatar :src="comment.avatar"></avatar>
    <div class="comment__message">
      <div class="comment__info">
        <span class="comment__username">{{comment.username_as}}</span>
        <span class="comment__time"><i class="fa fa-clock-o"></i> {{comment.time}}</span>
      </div>
      <div>{{{ message }}}</div>
    </div>
  </div>
</template>

<script>
import EmbedJS from 'embed-js';
import marked from 'marked';
import highlight from 'highlight.js';
import Avatar from './Avatar';

export default {
  components: { Avatar },
  props: ['comment','onupdate'],
  ready(){
    this.onupdate();
  },
  created() {
    const comment = this.comment;
    if(comment.isImageAttachment()){
      const self = this;
      this.message = `<div class="image-container">Loading image ...</div>`;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
          const src = URL.createObjectURL(this.response);
          self.message = `<div class="image-container"><img src="${src}" alt="${comment.getAttachmentURI()}" /></div>`
          self.onupdate();
        }
      }
      xhr.open('GET', comment.getAttachmentURI());
      // xhr.setRequestHeader('Authorization', 'Token token='+window.doctortoken);
      xhr.responseType = 'blob';
      xhr.send();
    } else {
      this.x.text((data) => {
        this.message = data;
        this.onupdate();
      });
    }
  },
  data () {
    return {
      message: '',
      x: new EmbedJS({
        input: this.comment.message,
        highlightCode: true,
        marked: true,
        emoji: true,
        plugins: {
          marked: marked,
          highlightjs: highlight
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.comment .avatar {
  border: 2px solid #3EC4AF;
  min-width: 30px;
  margin-right: 15px;
  position: relative;
  z-index: 2;
  width: 50px !important; height: 50px !important;
}
.comment .avatar img {
  width: 50px !important; height: 50px !important;
}
.comment {
  display: flex;
  position: relative;
  font-size: 12px;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 10px; left: 25px;
    border: 1px dotted #ccc;
    width: 1px; height: 100%;
    z-index: 1;
  }
}
.comment__message {
  padding-top: 5px;
  line-height: 1.7em;
  min-height: 68px;
  padding-bottom: 15px;
  margin-bottom: 15px;
  width: 100%;
  background: #F4F4F4;
  padding: 10px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 3px 5px rgba(0,0,0,.15);
  :after {
    right: 100%;
    top: 30px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(238, 238, 238, 0);
    border-right-color: #F4F4F4;
    border-width: 15px;
    margin-top: -15px;
  }
}
.comment__message p {
  margin: 0;
}
.comment__info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 7px;
}
.comment__username {
  font-weight: bold; line-height: 1;
  color: #71cd9d;
}
.comment__time {
  font-size: 10px;
  color: #999;
}
.image-container {
  width: 300px; height: 300px; overflow: hidden;
  padding: 10px;
  border: 1px solid #ccc; border-radius: 5px;
  img {
    // max-width: 300px;
  }
}
</style>
