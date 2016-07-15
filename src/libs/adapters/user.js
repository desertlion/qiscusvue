import store from 'store';

export default class User {
  /**
  * Params used in this class
  * @method constructor
  * @param  {Object}    HTTPAdapter [Qiscus HTTP adapter]
  * @return {void}                Returns nothing
  */
  constructor (HTTPAdapter) {
    this.HTTPAdapter = HTTPAdapter;
    this.token       = HTTPAdapter.token;
  }

  login (email, password) {
    const userdata = {
      "user[email]": email,
      "user[password]": password
    }
    return this.HTTPAdapter.post('users/sign_in', userdata)
    .then((res) => {
      return new Promise((resolve, reject) => {
        if(res.body.success != true) return reject(res);
        const data = res.body;
        store.set('qcData', data)
        return resolve(data);
      })
    }, (error) => {
      return new Promise((resolve, reject) => {
        return reject(err);
      });
    })
  }

  postComment(topicId, commentMessage, uniqueId) {
    return this.HTTPAdapter.post(`api/v1/mobile/postcomment`, {token: this.token, comment: commentMessage, topic_id: topicId})
    .then((res) => {
      return new Promise((resolve, reject) => {
        if(res.body.success != true) return reject(res);
        const data = res.body;
        return resolve(data);
      })
    }, (error) => {
      return new Promise((resolve, reject) => {
        return reject(err);
      });
    })
  }

}
