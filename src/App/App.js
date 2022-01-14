import React from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import BikeCard from '../components/BikeCard';
import Footer from '../components/Footer';
import Background from '../components/Background';
import Poller from '../utils/poller';
import { setUser } from '../utils/firebase';
import styles from './App.module.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function getMe() {
  try {
    const response = await axios.get('/api/v1/me');
    return response.data;
  } catch (err) {
    return undefined;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      profile: undefined,
      unit: 'km',
    };
    this.onPollResponse = this.onPollResponse.bind(this);
    this.onUnitChange = this.onUnitChange.bind(this);
    this.onStartSync = this.onStartSync.bind(this);

    this.poller = new Poller(
      {
        endpoint: '/api/v1/me',
      },
      this.onPollResponse
    );
  }

  async componentDidMount() {
    const me = await getMe();
    this.setState({
      initialized: true,
      profile: me,
    });
    if (me && me.syncStatus.status !== 'Synced') {
      setUser(me.id);
      this.poller.start();
    }
  }

  componentWillUnmount() {
    this.poller.stop();
  }

  onPollResponse(data) {
    if (data.syncStatus.status === 'Synced') {
      this.poller.stop();
    }
    this.setState({
      profile: data,
    });
  }

  onUnitChange() {
    const { unit } = this.state;

    this.setState({
      unit: unit === 'km' ? 'mi' : 'km',
    });
  }

  async onStartSync() {
    try {
      const { profile } = this.state;
      await axios.post('/api/v1/me/resync');
      this.setState({
        profile: {
          ...profile,
          syncStatus: {
            status: 'Syncing',
          },
        },
      });
      this.poller.start();
    } catch (err) {
      return undefined;
    }
  }

  renderBikes(bikes) {
    if (!bikes) {
      return null;
    }

    const { unit } = this.state;
    const bikesArr = Object.keys(bikes)
      .reduce((prev, curr) => {
        prev.push({ ...bikes[curr], key: curr });
        return prev;
      }, [])
      .sort((a, b) => (a.primary ? -1 : 1));

    return (
      <div>
        {bikesArr.map((bike) => (
          <BikeCard key={bike.key} bike={bike} unit={unit} />
        ))}
      </div>
    );
  }

  render() {
    const { profile, initialized, unit } = this.state;
    const bikes =
      profile &&
      profile.syncStatus.status !== 'PendingInitialSync' &&
      profile.bikes;

    return (
      <div className={styles.App}>
        {initialized && (
          <Hero
            profile={profile}
            onUnitChange={this.onUnitChange}
            onStartSync={this.onStartSync}
            unit={unit}
          />
        )}
        {this.renderBikes(bikes)}
        <Footer />
        <Background />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop
          pauseOnHover
        />
      </div>
    );
  }
}

export default App;
