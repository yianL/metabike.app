import axios from 'axios';
import Hero from '../components/Hero';
import BikeCard from '../components/BikeCard';

import Footer from '../components/Footer';
import styles from './App.module.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

async function getMe() {
  try {
    const response = await axios.get('/api/v1/me');
    return response.data;
  } catch (err) {
    // toast.error(err.toString());
    return undefined;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      profile: undefined,
    };
  }

  async componentDidMount() {
    const me = await getMe();
    this.setState({
      initialized: true,
      profile: me,
    });
  }

  render() {
    const { profile, initialized } = this.state;

    return (
      <div className={styles.App}>
        {initialized && <Hero profile={profile} />}
        {profile &&
          profile.bikes &&
          Object.keys(profile.bikes).map((key) => (
            <BikeCard key={key} bike={profile.bikes[key]} />
          ))}
        <Footer />
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
