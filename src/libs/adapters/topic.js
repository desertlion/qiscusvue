
export default class TopicAdapter {
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

  loadComments(topic_id) {
    return this.HTTPAdapter.get(`api/v1/mobile/load_comments?token=${this.token}&topic_id=${topic_id}`)
    .then((res) => {
      return new Promise((resolve, reject) => {
        if(res.status != 200) return new Promise((resolve, reject) => reject(res));
        const data = res.body.results;
        return resolve(data);
      })
    }, (error) => {
      console.info('failed loading', error);
      return new Promise((resolve, reject) => {
        return reject(error);
      });
    })
  }

}
