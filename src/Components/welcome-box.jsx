import React from "react";
import "../Components/welcome-box.css";
import Logo from "../img/Logo.png";

export default function WelcomeBox() {
  return (
    <section className="welcome_box">
      <div className="welcome_box_data">
        <h1>
          <font>
            Hi Everyone, Welcome To <br />
            <font color="#3f4cad">IEDC-SNMIMT</font>
          </font>
        </h1>

        <p>
          Not only can you purchase tickets to the hottest events in town, but
          you can also create your own custom tickets with our easy-to-use
          platform. Say goodbye to generic tickets and hello to personalized and
          professional-looking ones that will make your event stand out from the
          rest.
        </p>
      </div>
      <div className="welcome_box_img">
        <img src={Logo} alt="Logo" />
      </div>
    </section>
  );
}
