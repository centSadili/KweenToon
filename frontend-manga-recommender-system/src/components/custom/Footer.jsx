import React from 'react';
import '../styles/Footer.css'; 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Logo + Socials */}
        <div className="footer-column">
          <h2 className="footer-logo">Kwentoon</h2>
          <div className="social-icons">
            <a href="#" className="social-icon fb">Facebook</a>
            <a href="#" className="social-icon ig">Instagram</a>
            <a href="#" className="social-icon x">X</a>
            <a href="#" className="social-icon tiktok">TikTok</a>
          </div>
        </div>

        {/* Column 2: Collabs/Sponsors */}
        <div className="footer-column">
          <h3>Collabs / Sponsors</h3>
          <ul>
            <li>ToonGod</li>
            <li>Eat Bulaga</li>
            <li>National University Moa</li>
          </ul>
        </div>

        {/* Column 3: About Us */}
        <div className="footer-column">
          <h3>About Us</h3>
          <p>Kwentoon is a platform made to connect storytellers, readers, and creators in one awesome creative space.</p>
        </div>

        {/* Column 4: Community */}
        <div className="footer-column">
          <h3>Community</h3>
          <ul>
            <li><a href="#">Forums</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Events</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; Kwentoon 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;