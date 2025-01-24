import React from "react";
import "../Components/Event.css";
import { DUMMY_EVENTS } from "./event_list";

export default function EventFrame({ Id, image }) {
  return (
    // do a loop of dummy_event
    <div className="block">
      <div id={Id}>
        <img src={image} alt={DUMMY_EVENTS[0].title} />
        <div id="moment">
          <span id="date">{DUMMY_EVENTS[0].date}</span>
          <span id="time">{DUMMY_EVENTS[0].time}</span>
        </div>
        <div id="details">
          <span id="title">{DUMMY_EVENTS[0].title}</span>
          <span id="discription">{DUMMY_EVENTS[0].discription}</span>
        </div>
      </div>
    </div>
  );
}
