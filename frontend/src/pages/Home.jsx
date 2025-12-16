import React from 'react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard'; 
import EventRow from '../components/EventRow';   
import Footer from '../components/Footer';

const Home = () => {
  
  // Data Dummy: Top Events
  const topEvents = [
    {
      id: 1,
      title: "Bell's Comedy Club",
      date: "Jumat, 12 Des 2025 • 20.00",
      location: "Balai Sarbini, Jakarta",
      price: "Rp 150.000",
      image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Club"
    },
    {
      id: 2,
      title: "Open Mic Night",
      date: "Minggu, 14 Des 2025",
      location: "The Hall, Bandung",
      price: "Rp 75.000",
      image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Open+Mic"
    },
    {
      id: 3,
      title: "Comedy Kings Tour",
      date: "Sabtu, 14 Des 2025",
      location: "Grand City, Surabaya",
      price: "Rp 125.000",
      image: "https://placehold.co/400x300/1a1a1a/F59E0B?text=Comedy+Tour"
    }
  ];

  // Data Dummy: Upcoming Events
  const upcomingEvents = [
    {
      id: 101,
      title: "Comedy Night Rising Stars",
      date: "Sabtu, 20 Des 2025",
      location: "Teater Jakarta",
      price: "Rp 150.000",
      image: "https://placehold.co/200x150/purple/white?text=Rising+Star",
      isAvailable: true
    },
    {
      id: 102,
      title: "Laugh Out Loud Fest",
      date: "Minggu, 21 Des 2025",
      location: "Sabuga, Bandung",
      price: "Rp 125.000",
      image: "https://placehold.co/200x150/white/black?text=LOL+Fest",
      isAvailable: true
    },
    {
      id: 103,
      title: "Weekend Comedy Club",
      date: "Sabtu, 27 Des 2025",
      location: "Plaza Surabaya",
      price: "Rp 175.000",
      image: "https://placehold.co/200x150/red/white?text=Weekend+Club",
      isAvailable: false 
    }
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div className="container" style={{textAlign: 'center', paddingTop: '80px'}}>
          <p style={{letterSpacing: '5px', marginBottom: '10px'}}>EKRESA</p>
          <h1 style={styles.heroTitle}>CERITA ANEHKU</h1>
          <p>Sebuah pertunjukan komedi oleh Raditya Dika</p>
        </div>
      </div>

      <div className="container" style={{paddingTop: '40px', paddingBottom: '60px'}}>
        
        {/* SECTION 1: TOP EVENTS */}
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={{fontSize: '24px', margin: 0}}>Top Events</h2>
            <p style={{color: '#9CA3AF', margin: '5px 0'}}>Event komedi terpanas minggu ini!</p>
          </div>
          <a href="#" style={{color: '#F59E0B', textDecoration: 'none'}}>View All →</a>
        </div>

        <div style={styles.grid}>
          {topEvents.map(item => (
            <EventCard key={item.id} {...item} />
          ))}
        </div>

        {/* SECTION 2: UPCOMING EVENTS */}
        <div style={{marginTop: '60px'}}>
          <h2 style={{fontSize: '24px', color: '#F59E0B', marginBottom: '20px'}}>Upcoming Events</h2>
          <p style={{color: '#9CA3AF', marginBottom: '20px'}}>Amankan kursimu sekarang!</p>
          
          <div style={styles.list}>
            {upcomingEvents.map(item => (
              <EventRow key={item.id} {...item} />
            ))}
          </div>

          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button className="btn btn-blue" style={{padding: '12px 30px'}}>
              Explore More Events
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

const styles = {
  hero: {
    height: '400px',
    backgroundColor: '#050a14',
    backgroundImage: 'linear-gradient(to bottom, rgba(11,17,32,0.3), #0B1120), url(https://placehold.co/1200x600/111/333?text=Hero+Banner)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white'
  },
  heroTitle: {
    fontSize: '64px',
    color: '#F59E0B',
    margin: 0,
    fontWeight: '800'
  },
  sectionHeader: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'end', 
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  }

};

export default Home;