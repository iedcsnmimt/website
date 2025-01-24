import React from "react";
import EventFrame from "./EventFrame";
import "../Components/Event.css";
import event from "../img/event.png";

export default function Event() {
  return (
    <div className="events">
      <h1>Event Shedule</h1>
      <EventFrame Id="one" image={event} />
      <EventFrame Id="two" image={event} />
      <EventFrame Id="three" image={event} />
      <EventFrame Id="four" image={event} />
      <EventFrame Id="five" image={event} />
      <EventFrame Id="six" image={event} />
      <button>View More</button>
    </div>
  );
}
