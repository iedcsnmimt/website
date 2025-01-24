import React from "react";
import "../Components/Partners.css";
import ed_club from "../img/Ed.png";
import iiclogo from "../img/iiclogo.png";
import tinkerlogo from "../img/tinkerhub.png";
import yiplogo from "../img/yip.png";

export default function Partners() {
  return (
    <div className="partners">
      <h1>collaborative</h1>
      <div className="logo">
        <img src={iiclogo} alt="IIC Logo" id="one" />
        <img src={ed_club} alt="ED Logo" id="two" />
        <img src={tinkerlogo} alt="TINKER Logo" id="three" />
        <img src={yiplogo} alt="YIP Logo" id="four" />
      </div>
    </div>
  );
}
