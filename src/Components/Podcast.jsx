import React from "react";
import "./Podcast.css";
import Pod from "../img/podcast.png";

export default function Podcast() {
  return (
    <>
      <div className="podcast">
        <h1>Our Podcast</h1>
        <div className="player">
          <img src={Pod} alt="Podcast" />
        </div>
      </div>
    </>
  );
}
