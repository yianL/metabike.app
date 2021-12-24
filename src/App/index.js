import Hero from '../components/Hero';
import Footer from '../components/Footer';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
      <Hero />
      <Footer />
    </div>
  );
}

export default App;
