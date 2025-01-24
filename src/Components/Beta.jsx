import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./Beta.css";


export default function AboutBeta() {
    const navigate = useNavigate();
  
    const navigateToStartupList = () => {
      navigate("/startuplist");
    };
  
    return (
      <div className="partners">
        <h1 className="title">About Beta</h1>
        <p className="Vision">
          Beta is an initiative by IEDC SNMIMT designed to empower startups and
          foster innovation. We provide resources, mentorship, and funding
          opportunities to help early-stage businesses succeed in the competitive
          market.
        </p>
        
        <button
          onClick={navigateToStartupList}
          className="btn-startup-list"
        >
          View Startups
        </button>
      </div>
    );
  }