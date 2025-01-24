import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Typography, Grid, Link } from "@mui/material";
import { LinkedIn, Instagram, GitHub } from "@mui/icons-material";
import Footer from "./footer.js";
import NavBar from "./Navbar.js";
import "../css/Home.css";
import "../css/cards.css";
import iedclogo from "../img/iedclogo.png";

function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage();

  // Function to upload an image to Firebase Storage
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `img/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
  };

  useEffect(() => {
    // Dummy image file for demonstration purposes
    const imageFile = null; // Replace with your image file

    if (imageFile) {
      uploadImage(imageFile);
    }
  }, []);

  useEffect(() => {
    const sr = ScrollReveal({
      origin: "top",
      distance: "60px",
      duration: 2000,
      delay: 200,
    });

    sr.reveal(".reveal", {});
  }, []);

  return (
    <div>
      <NavBar />
      <section className="home bd-grid " id="home">
        <div className="home__data">
          <h5 className="home__title">
            Hi Everyone, Welcome
            <span>To</span>
            <span className="home__title-color"> IEDC-SNMIMT</span>
          </h5>
          <a
            href="https://iedcsnmimtwiki.super.site"
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wiki
          </a>
        </div>

        {/* <div className="home__social">
            <a href="#" className="home__social-icon">
              <i className="bx bxl-linkedin"></i>
            </a>
            <a
              href="https://instagram.com/iedc.snm"
              className="home__social-icon"
            >
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="#" className="home__social-icon">
              <i className="bx bxl-github"></i>
            </a>
          </div>

          <div className="home__img">
            <svg width="0" height="0">
              <clipPath id="custom-mask">
                <path d="M9.19024 145.964C34.0253 76.5814 114.865 54.7299 184.111 29.4823C245.804 6.98884 311.86 -14.9503 370.735 14.143C431.207 44.026 467.948 107.508 477.191 174.311C485.897 237.229 454.931 294.377 416.506 344.954C373.74 401.245 326.068 462.801 255.442 466.189C179.416 469.835 111.552 422.137 65.1576 361.805C17.4835 299.81 -17.1617 219.583 9.19024 145.964Z" />
              </clipPath>
            </svg>
            <img
              className="img"
              src={iedclogo}
              alt="IEDC Logo"
              style={{
                clipPath: "url(#custom-mask)",
                boxShadow: "0 0 10px purple",
                marginLeft: "1rem",
              }}
            />
          </div>
        </div> */}
      </section>

      <section className="home bd-grid">
        <div className="home__data">
          <h1 className="home__title__info">
            "Creativity is just connecting things"
          </h1>
          <span className="home__title-color">
            <h1 className="home__title__info__min">-Steve Jobs</h1>
          </span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about section" id="about">
        <h2 className="section-title">About</h2>
        <div className="about__container bd-grid">
          <div className="about__img">
            <img className="img" src={iedclogo} alt="IEDC Logo" />
          </div>
          <div>
            <h2 className="about__subtitle">IEDC-SNMIMT</h2>
            <p className="about__text">
              IEDC has been developed to foster and nurture innovations combined
              with entrepreneurship amongst young minds, there is growth
              potential to be untapped and IEDC aims to fill this abyss.
            </p>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="about section" id="vision">
        <h2 className="section-title">Vision</h2>
        <div className="about__container_vision">
          <div className="about__subtitle">
            <h2 className="about__text">
              "To dive into the inner potential and to promote technological
              disruptions when proffering the nurturing mind to think laterally
              and divergently, IEDC is a body to develop entrepreneurial skills
              and to foster innovations to start up."
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
