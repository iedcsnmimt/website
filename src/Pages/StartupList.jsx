import React, { useState } from "react";
import "./Startup.css";
import iedclogo from "../img/iedclogo.png";
import { StartupData } from "./Data/StartupData";

const StartupList = () => {
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (index) => {
    setSelectedStartup(index);
  };

  const closeModal = () => {
    setSelectedStartup(null);
  };

  const filteredStartups = StartupData.filter(
    (startup) =>
      startup.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.coFounderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="startup-container">
      {/* Page Title */}
      <h1 className="title">Our Innovative Startups</h1>

      {/* About Beta Section */}
      <div className="about-beta">
        <h2>About Beta - Business Entrepreneurship Technology & Accelerator</h2>
        <p>
          Beta is an initiative by IEDC SNMIMT to empower startups and foster
          innovation. Through our accelerator program, we provide resources,
          mentorship, and funding opportunities to help startups succeed.
        </p>
        <p>
          <strong>Student In-Charge:</strong> CEO, IEDC SNMIMT
        
        </p>
        <p>
        <strong>Staff In-Charge:</strong> Mrs. Chaithanya Raj - Nodal Officer, IEDC SNMIMT
        
        </p>
       
        <p>
          For any inquiries related to Beta, contact us at{" "}
          <a href="mailto:ceoiedcsnmimt@gmail.com">ceoiedcsnmimt@gmail.com</a>{" "}
          or <a href="mailto:iedc@snmimt.edu.in">iedc@snmimt.edu.in</a>.
        </p>
        <blockquote>
        "The only way to do great work is to love what you do." – Steve Jobs
        </blockquote>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Company Name or Founder Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Startup Cards */}
      <div className="card-container">
        {filteredStartups.map((startup, index) => (
          <div key={index} className="card" onClick={() => openModal(index)}>
            <div className="logo-wrapper">
              <img
                src={startup.logo}
                alt={`${startup.companyName} logo`}
                className="startup-logo"
              />
              {/* Badges */}
              {(startup.msme || startup.beta || startup.pvt || startup.llp || startup.opc) && (
                <div className="badge-container">
                  {startup.msme && <span className="badge msme-badge">MSME</span>}
                  {startup.beta && <span className="badge beta-badge">BETA</span>}
                  {startup.pvt && <span className="badge pvt-badge">PVT</span>}
                  {startup.llp && <span className="badge llp-badge">LLP</span>}
                  {startup.opc && <span className="badge opc-badge">OPC</span>}
                </div>
              )}
            </div>
            <div className="card-content">
              <h2>{startup.companyName}</h2>
            </div>
          </div>
        ))}
      </div>

      {selectedStartup !== null && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      {/* Startup Logo */}
      <img
        src={StartupData[selectedStartup].logo}
        alt={`${StartupData[selectedStartup].companyName} logo`}
        className="expanded-logo"
      />

      {/* Dynamic Details */}
      <h2>{StartupData[selectedStartup].companyName}</h2>
      <p>
        <strong>Founders:</strong> {StartupData[selectedStartup].coFounderName}
      </p>
      <p>
        <strong>Type:</strong> {StartupData[selectedStartup].startupType}
      </p>
      <p>
        <strong>Description:</strong> {StartupData[selectedStartup].description}
      </p>
      <p>
        <strong>Legal Status:</strong> {StartupData[selectedStartup].legalStatus}
      </p>
      <p>
        <strong>Contact:</strong> {StartupData[selectedStartup].phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {StartupData[selectedStartup].email}
      </p>

      {/* Team Members */}
      {StartupData[selectedStartup].team && 
              StartupData[selectedStartup].teamMembers.length > 0 && (
                <div className="team-section">
                  <h3 className="team-title">Team Members</h3>
                  <ul>
                    {StartupData[selectedStartup].teamMembers.map((member, idx) => (
                      <li key={idx}>{member}</li>
                    ))}
                  </ul>
                </div>
            )}

      {/* External Work Taken */}
      <p>
        <strong>External Work:</strong>{" "}
        {StartupData[selectedStartup].externalWorkTaken ? "Yes" : "No"}
      </p>

      {/* MSME, Beta, Pvt, LLP, OPC */}
      <div className="status-badges">
        {StartupData[selectedStartup].msme && <span className="badge">MSME</span>}
        {StartupData[selectedStartup].beta && <span className="badge">BETA</span>}
        {StartupData[selectedStartup].pvt && <span className="badge">PVT</span>}
        {StartupData[selectedStartup].llp && <span className="badge">LLP</span>}
        {StartupData[selectedStartup].opc && <span className="badge">OPC</span>}
      </div>

      {/* Website Link */}
      <a
        href={StartupData[selectedStartup].website}
        target="_blank"
        rel="noopener noreferrer"
        className="website-link"
      >
        Visit Website
      </a>
    </div>
  </div>
)}

    </div>
  );
};

export default StartupList;
