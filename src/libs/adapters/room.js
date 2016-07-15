
export default class RoomAdapter {
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

  loadRooms() {
    return this.HTTPAdapter.get('api/v1/mobile/load_rooms?token='+this.token)
    .then((res) => {
      return new Promise((resolve, reject) => {
        if(res.body.status != 200) return new Promise((resolve, reject) => reject(res));
        const data = res.body.results;
        return resolve(data);
      })
    }, (error) => {
      return new Promise((resolve, reject) => {
        return reject(error);
      });
    })
  }

  loadTopics(room_id) {
    return this.HTTPAdapter.get('api/v1/mobile/topics?token='+this.token+'&room_id='+room_id)
    .then((res) => {
      return new Promise((resolve, reject) => {
        if(res.status != 200) return new Promise((resolve, reject) => reject(res));
        const data = res.body.results;
        return resolve(data);
      })
    }, (error) => {
      return new Promise((resolve, reject) => {
        return reject(error);
      });
    })
  }

}
