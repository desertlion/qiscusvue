import qiscus from '../libs/qiscus';
export const login = ({ dispatch, state }, email, password) => {
  qiscus.login(email, password).then((response) => {
    qiscus.updateConfig('token', response.token);
    dispatch('LOGIN_SUCCESS', response);
  }, (error) => {
    dispatch('LOGIN_ERROR', error)
  });
}

export const loadRooms = ({ dispatch, state }) => {
  qiscus.loadRooms().then((response) => {
    dispatch('UPDATE_ROOM', qiscus.rooms);
    dispatch('SELECT_ROOM', qiscus.rooms[0], qiscus.rooms[0].topics[0]);
  }, (error) => {
    console.error('error loading rooms', error);
  });
}

export const selectRoom = ({ dispatch, state }, room_id) => {
  console.info('clicking room of id', room_id)
  qiscus.selectRoom(room_id).then((response) => {
    console.info('clicking room of id', room_id)
    dispatch('SELECT_ROOM', qiscus.selected.room, qiscus.selected.topic);
  })
}

export const selectTopic = ({dispatch, state}, topic_id) => {
  qiscus.selectTopic(topic_id).then((response) => {
    dispatch('SELECT_TOPIC', qiscus.selected);
  })
}

export const submitComment = ({dispatch, state}, topic_id, comment, unique_id) => {
  qiscus.submitComment(topic_id, comment, unique_id).then((response) => {
    dispatch('UPDATE_ROOM', qiscus.rooms);
    // dispatch('SUBMIT_COMMENT', qiscus.selected);
  })
}
