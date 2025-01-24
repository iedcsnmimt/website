import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Container, Typography, Grid, Link } from "@mui/material";
import { LinkedIn, Instagram, GitHub } from "@mui/icons-material";
import NavBar from "./Navbar.js";
import WelcomeBox from "../Components/welcome-box.jsx";
import Discription from "../Components/Discription.jsx";
import Podcast from "../Components/Podcast.jsx";
import Event from "../Components/Event.jsx";
import Partners from "../Components/Partners.jsx";
import Contact from "../Components/Contact.jsx";
import "../css/Home.css";
import "../css/cards.css";
import AboutBeta from "../Components/Beta.jsx";

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
    <>
      <NavBar />
      <WelcomeBox />
      <Discription />
      <Podcast />
     <AboutBeta/>
      <Partners />
      <Contact />
    </>
  );
}
export default Home;
