import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

function Navbar() {
  return (
    <nav className="nav bd-grid">
      <div>
        <a href="#" className="nav__logo">
          IEDC SNMIMT
        </a>
      </div>

      <div className="nav__menu" id="nav-menu">
        <ul className="nav__list">
          <li className="nav__item">
            <a href="#home" className="nav__link active">
              Home
            </a>
          </li>
        {/*  <li className="nav__item">
            <a href="#about" className="nav__link">
              About
            </a>
          </li>
          
          <li className="nav__item">
            <a href="#Gallery" className="nav__link">
              Gallery
            </a>
          </li>
          <li className="nav__item">
            <a href="#team" className="nav__link">
              Team
            </a>
          </li>
          <li className="nav__item">
            <a href="#mystore" className="nav__link">
              Mystore
            </a>
          </li> */}
          <li className="nav__item">
          <a href="https://opaliedc.vercel.app" className="nav__link" target="_blank" rel="noopener noreferrer">
  Opal
</a>

          </li>
          <li className="nav__item">
          <a href="https://instagram.com/iedc.snm" className="nav__link" target="_blank" rel="noopener noreferrer">
  Instagram Page
</a>

          </li>

          <li className="nav__item">
          <a href="https://lookerstudio.google.com/reporting/d9cc84d5-dcad-44a3-bccb-dd226a9d3da4" className="nav__link" target="_blank" rel="noopener noreferrer">
  Lead's Scores Board
</a>

          </li>

          <li className="nav__item">
          <a href="https://tinkerhubsnmimt.super.site/" className="nav__link" target="_blank" rel="noopener noreferrer">
  TinkerHub
</a>

          </li>

        {/*  <li className="nav__item">
            <a href="#contact" className="nav__link">
              Contact
            </a>
          </li>*/}

        </ul>
      </div>

      {/* Toggle button as a Link to /login */}
      <Link to="/login">
        Login
      </Link>
    </nav>
  );
}

export default Navbar;
