import _ from 'lodash';
import moment from 'moment';
import store from 'store';
import envConfig from '../config.js';
import HttpAdapter from './adapters/http';
import UserAdapter from './adapters/user';
import RoomAdapter from './adapters/room';
import TopicAdapter from './adapters/topic';

class qiscus {
  constructor () {
    let config    = { baseURL: envConfig.baseURL, token: (store.get('qcData')) ? store.get('qcData').token : null };
    this.config   = config;
    this.rooms    = [],
    this.selected = { room: null, topic: null }
    this.pendingCommentId;

    ///////////////// API CLIENT /////////////////
    this.HTTPAdapter = new HttpAdapter(this.config.baseURL, this.config.token)

    //////////////// CORE BUSINESS LOGIC ////////////////////////
    // this.messageAdapter   = new MessageAdapter(this.HTTPAdapters);
    this.userAdapter      = new UserAdapter(this.HTTPAdapter);
    this.roomAdapter      = new RoomAdapter(this.HTTPAdapter);
    this.topicAdapter     = new TopicAdapter(this.HTTPAdapter);
    // this.videoCallAdapter = new VideoCallAdapter(this.HTTPAdapters);
  }
  updateConfig (key, value) {
    this.config[key] = value;
  }
  login (email, password) {
    return this.userAdapter.login(email, password);
  }

  /////////// ROOM RELATED FUNCTION //////////////
  loadRooms () {
    return this.roomAdapter.loadRooms().
    then((response) => {
      _.map(response, (res) => {
        this._addRoom(new Room(res));
      });
      // let's select the first room
      return this.selectRoom(this.rooms[0].id);
    });
  }

  selectRoom(room_id) {
    const room = this._getRoom(room_id);
    if(room.topics.length < 1) {
      // this room hasn't been loaded yet, let's load it
      return this.loadTopics(room_id).then((response) => {
        this.selected.room  = room;
        this.selected.topic = room.topics[0];
      });
    } else {
      this.selected.room  = room;
      this.selected.topic = room.topics[0];
      return new Promise((resolve, reject) => resolve(this.selected));
    }
  }

  selectTopic(topic_id) {
    let room = this.selected.room;
    let topic = room.getTopic(topic_id);
    // check if messages has been loaded or not
    if(topic.comments.length < 1) {
      return this.loadComments(topic_id).then((response) => { this.selected.topic = topic });
    }
    this.selected.topic = topic;
    return new Promise((resolve, reject) => resolve(topic));
  }

  loadTopics(room_id) {
    // note: when we load a topic, we also need to load its' message directly

    return this.roomAdapter.loadTopics(room_id).
    then((response) => {

      // let's add this topics to rooms
      const room = this._getRoom(room_id);
      _.map(response.topics, (res) => {
        let topic = new Topic(res);
        room.addTopic(new Topic(topic));
      })

      // now load the first topic messages
      let topic = room.topics[0];
      if(topic.comments.length < 1) {
        return this.loadComments(topic.id);
      } else {
        return new Promise((resolve, reject) => resolve(room.topics));
      }

    })
  }

  loadComments(topic_id) {
    return this.topicAdapter.loadComments(topic_id)
    .then((response) => {
      // get the topic
      let room = this._getRoomOfTopic(topic_id);
      let topic = room.getTopic(topic_id);
      _.map(_.reverse(response.comments), (comment) => {
        topic.addComment(new Comment(comment));
      });
      return new Promise((resolve, reject) => resolve(topic));
    }, (error) => {
      console.error('Error loading comments', error);
    });
  }

  submitComment(topicId, commentMessage, uniqueId) {
    var self = this;
    var room = self._getRoomOfTopic(topicId);

    self._pendingCommentId--;
    var pendingCommentId     = self._pendingCommentId;
    // var pendingCommentSender = room.getParticipant(store.get('qcData').email);
    var pendingCommentDate   = new Date();
    var qcData = store.get('qcData');
    var commentData = {
      message: commentMessage,
      username_as: qcData.username,
      username_real: 'me',
      user_avatar: {
        avatar: {
          url: qcData.avatar
        }
      },
      id: pendingCommentId
    }
    var pendingComment       = new Comment(commentData);
    // We're gonna use timestamp for uniqueId for now.
    // "bq" stands for "Bonjour Qiscus" by the way.
    if(!uniqueId) {
      uniqueId = "bq" + Date.now()
    }
    // 		var uniqueId = "bq" + Date.now();
    pendingComment.attachUniqueId(uniqueId);
    pendingComment._markAsPending();
    this.receiveComment(topicId, pendingComment, uniqueId);
    return this.userAdapter.postComment(topicId, commentMessage, uniqueId,
      function(res) {
        // When the posting succeeded, we mark the Comment as sent,
        // so all the interested party can be notified.
        pendingComment._markAsSent();

        return new Promise((resolve, reject) => resolve(res));
      },
      function(reason) {
        pendingComment.markAsFailed();
        return new Promise((resolve, reject) => reject(reason));
      }
    );
  }

  receiveComment(topicId, comment, uniqueId) {
    var _this = this;
    var room  = this._getRoomOfTopic(topicId);
    var topic = room.getTopic(topicId);
    if(uniqueId){
      var commentWtUniqueId = _.find(topic.comments, function(cmt){
        return cmt.uniqueId == uniqueId;
      });
      //if uniqueId exist and comment id fake exist, it will delete fake comment
      if(commentWtUniqueId && commentWtUniqueId.length != 0 && comment.id < 0){
        _.remove(topic.comments, function(cmt){
          return uniqueId == cmt.uniqueId;
        })
      }
    }

    // Add the comment.
    topic.addComment(comment);
    // Update unread count if necessary. That is, if these two
    // conditions are met:
    // 1. The Comment doesn't belong to the currently selected
    //    Topic. Because it doesn't makes sense to have unread
    //    Comments when the User is currently watching the
    //    Topic, does it?
    // 2. The Comment owner is not the current User. Because
    //    it doesn't make for the User to not read what he/she
    //    wrote.
    // if ( topic != this.selected.topic && comment.sender.email != this.email ) {
    //   topic.increaseUnreadCommentsCount();
    // }
    // If the topic is the currently selected Topic, then
    // we should reset the first unread Comment, because
    // it means that the user (most likely) already read
    // all the unread comments in the Topic.
    // if (topic == this.selected.topic) {
    //   topic.resetFirstUnreadComment();
    // }
    //Check if comment is uploadComment
    //It will not update the id --> if it updates the id it'll be the last room
    // if(!comment.isUploadComment){
    //   // Update last Topic ID and the last Comment ID of the Room if the
    //   // Comment is sent.
    //   if (comment.isSent) {
    //     room.setLastTopicAndComment(topicId, comment.id);
    //   }
    // }
    // Finally, let's make sure the Rooms stay sorted.
    this.sortRooms();
  };

  sortRooms() {
    this.rooms.sort(function(leftSideRoom, rightSideRoom) {
      return rightSideRoom.lastCommentId - leftSideRoom.lastCommentId;
    });
  }

  _addRoom(room) {
    // check 1st if we already have the room
    const theroom = this._getRoom(room.id);
    if(!theroom) this.rooms.push(room);
  }

  _getRoom(room_id) {
    return _.find(this.rooms, {id: room_id});
  }

  _getRoomOfTopic(topic_id) {
    // TODO: This is expensive. We need to refactor
    // it using some kind map of topicId as the key
    // and roomId as its value.
    return _.find(this.rooms, function(room) {
      return _.find(room.topics, function(topic) {
        return topic.id == topic_id;
      });
    })
  }
}

export class Room {
  constructor(room_data){
    this.id                              = room_data.id;
    this.last_comment_id                 = room_data.last_comment_id;
    this.last_comment_message            = room_data.last_comment_message;
    this.last_comment_message_created_at = room_data.last_comment_message_created_at;
    this.last_comment_topic_id           = room_data.last_comment_topic_id;
    this.last_comment_topic_title        = room_data.last_comment_topic_title;
    this.avatar                          = room_data.room_avatar;
    this.name                            = room_data.name;
    this.room_type                       = room_data.room_type;
    this.secret_code                     = room_data.secret_code;
    this.participants                    = room_data.participants;
    this.topics                          = []
    this.count_notif                     = room_data.count_notif;
    this.isLoaded                        = false;
  }

  countUnreadComments() {
    if(this.topics.length == 0) {
      // means that this is not loaded yet, just return the notif
      return this.count_notif;
    } else {
      return _.chain(this.topics)
      .map((topic) => topic.comment_unread)
      .reduce((currentCount, topicCount) => { return currentCount + topicCount }, 0)
      .value();
    }
  }

  addTopic(Topic) {
    // Check if we got the topic in the list
    let topic = this.getTopic(Topic.id);
    if( topic ){
      // let's update the topic with new data
      topic = Object.assign({}, topic, Topic);
    } else {
      this.topics.push(Topic);
    }
  }

  getTopic(topic_id) {
    return _.find(this.topics, (topic) => {
      return topic.id == topic_id
    });
  }

  removeTopic(Topic) {
    const index = this.getTopicIndex(Topic.id);
    if(index < 0) return false;
    this.topics.splice(index, 1);
  }

  getParticipant(email) {
    var existingParticipant = _.find(this.participants, { 'email': participantEmail });

    if (existingParticipant) return existingParticipant;
    return null;
  }
}

export class Topic {
  constructor(topic_data) {
    this.id             = topic_data.id;
    this.title          = topic_data.title;
    this.comment_unread = topic_data.comment_unread;
    this.deleted        = topic_data.deleted || false;
    this.unread         = topic_data.unread;
    this.comments       = [];
    this.isLoaded       = false;
  }

  addComment(Comment) {
    // Check if we got the topic in the list
    let comment = this.getComment(Comment.id);
    if( comment ){
      // let's update the topic with new data
      comment = Object.assign({}, comment, Comment);
    } else {
      this.comments.push(Comment);
    }
  }
  getComment(comment_id) {
    return _.find(this.comments, (comment) => {
      return comment.id == comment_id
    });
  }
  markAsRead() {
    this.comment_unread = 0;
  }
  increaseUnreadCommentsCount() {
    this.comment_unread++;
  }
}

/**
* Qiscus Base Comment Class
*/
export class Comment {
  constructor(comment) {
    this.id            = comment.id;
    this.before_id     = comment.comment_before_id;
    this.message       = comment.message;
    this.username_as   = comment.username_as;
    this.username_real = comment.username_real;
    let theDate        = moment(comment.created_at);
    this.date          = theDate.format('YYYY-MM-DD');
    this.time          = theDate.format('HH:mm A');
    this.unique_id     = comment.unique_id;
    this.avatar        = comment.user_avatar.avatar.url;
    /* comment status */
    this.isPending = false;
    this.isSent    = false;
    this.isFailed  = false;
    this.attachment = null;
  }
  isAttachment() {
    return ( this.message.substring(0, "[file]".length) == "[file]" );
  }
  isImageAttachment() {
    return ( this.isAttachment() && this.message.match(/\.(jpg|gif|png)/i) != null );
  }
  attachUniqueId(unique_id) {
    this.unique_id = unique_id;
  }
  getAttachmentURI() {
    if(!this.isAttachment()) return;
    const messageLength = this.message.length;
    const beginIndex = "[file]".length;
    const endIndex   = messageLength - "[/file]".length;
    return this.message.substring(beginIndex, endIndex).trim();
  }
  setAttachment(attachment) {
    this.attachment = attachment;
  }
  _markAsPending() {
    this.isPending = true;
  }
  _markAsSent() {
    this.isSent = true;
  }
  _markAsFailed() {
    this.isFailed = true;
  }

}

let instance = null;
export default (function QiscusCoreSingleton() {
  if (!instance) instance = new qiscus();
  return instance;
})();
