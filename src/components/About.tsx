import Navbar from './Navbar';
import '../styles/About.css';

const About = () => {
  return (
    <div className="app-container">
      <Navbar />
      
      <div className="about-container">
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">About MovieApp</h1>
            <p className="about-subtitle">Your ultimate destination for discovering movies and TV shows</p>
          </div>
        </section>
        
        <section className="about-section">
          <div className="about-card">
            <div className="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v8m0 0l-4-4m4 4l4-4"></path>
                <circle cx="12" cy="14" r="8"></circle>
              </svg>
            </div>
            <h2>Our Mission</h2>
            <p>
              At MovieApp, we're passionate about connecting people with the films and shows they'll love. 
              Our mission is to create the most user-friendly, comprehensive platform for discovering, 
              exploring, and enjoying the world of cinema and television.
            </p>
          </div>
          
          <div className="about-card">
            <div className="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h2>What We Offer</h2>
            <p>
              Our platform provides access to a vast database of movies and TV shows, complete with 
              ratings, reviews, and detailed information. We offer personalized recommendations, 
              curated collections, and the latest updates from the entertainment world.
            </p>
          </div>
          
          <div className="about-card">
            <div className="about-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4l3 3"></path>
              </svg>
            </div>
            <h2>Our Story</h2>
            <p>
              Founded in 2023, MovieApp began as a passion project by a group of film enthusiasts 
              and tech innovators. What started as a simple movie database has evolved into a 
              comprehensive platform serving millions of movie and TV fans worldwide.
            </p>
          </div>
        </section>
        
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <h3>Advanced Search</h3>
              <p>Find exactly what you're looking for with our powerful search tools</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Enjoy a seamless experience across all your devices</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Your data is protected with state-of-the-art security</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🎬</div>
              <h3>Vast Collection</h3>
              <p>Access thousands of movies and TV shows in our database</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <h3>Ratings & Reviews</h3>
              <p>Make informed choices with community ratings and reviews</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🔄</div>
              <h3>Regular Updates</h3>
              <p>Stay current with the latest releases and entertainment news</p>
            </div>
          </div>
        </section>
        
      
        
        <section className="contact-section">
          <div className="contact-content">
            <h2 className="section-title">Get In Touch</h2>
            <p>Have questions, suggestions, or feedback? We'd love to hear from you!</p>
            
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} placeholder="Your message"></textarea>
              </div>
              
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
          
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>abutt3009@gmail.com</p>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📱</div>
              <h3>Phone</h3>
              <p>0311-7694349</p>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>123 Movie Street, xyz, CA 90028</p>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
