import axios from 'axios';

class Poller {
  constructor(config, cb) {
    const { endpoint, intervalMs = 5000 } = config;

    this.intervalMs = intervalMs;
    this.endpoint = endpoint;
    this.cb = cb;

    this.poll = this.poll.bind(this);
    this.poller = null;
  }

  start() {
    console.log('Starting poller...');
    this.poller = setTimeout(this.poll, this.intervalMs);
  }

  stop() {
    if (this.poller) {
      console.log('Stopping poller...');
      clearTimeout(this.poller);
    }
  }

  async poll() {
    try {
      const response = await axios.get(this.endpoint);
      this.poller = setTimeout(this.poll, this.intervalMs);
      this.cb(response.data);
    } catch (err) {
      console.error(err);
    }
  }
}

export default Poller;
