import React from "react";
import "../Components/Discription.css";
import event from "../img/wall.jpg";
import steve from "../img/steve.png";

export default function Discription() {
  return (
    <>
      <div className="About">
        <h1>About&nbsp;IEDC</h1>
        <p>
          IEDC has been developed to foster and nurture innovations combined
          with entrepreneurship amongst young minds, there is growth potential
          to be untapped and IEDC aims to fill this abyss.
        </p>
        <button>More&nbsp;About&nbsp;Us</button>
        
        <div id="quote">
          <h2>46+</h2>
          <span>Events In The Last Year</span>
        </div>
      </div>
      <div className="Vision">
        <img src={steve} alt="Steve Jobs" />
        <div id="quote">
          <h2>"Creativity is just connecting things"</h2>
          <span>Steve Jobs</span>
        </div>
        <h1>Our Vision</h1>
        <p>
          "To dive into the inner potential and to promote technological
          disruptions when proffering the nurturing mind to think laterally and
          divergently, IEDC is a body to develop entrepreneurial skills and to
          foster innovations to start up."
        </p>
      </div>
    </>
  );
}
