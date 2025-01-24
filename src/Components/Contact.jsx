import React, { useState } from "react";
import "../Components/Contact.css";
import { Facebook, Instagram, GitHub } from "@mui/icons-material"; // Importing Material-UI icons

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enquiry: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the mailto link with pre-filled details
    const { name, email, enquiry } = formData;
    const subject = "Contact Form Submission";
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AEnquiry: ${enquiry}`;

    // Open Gmail compose window with the pre-filled email
    const mailtoLink = `mailto:iedc@snmimt.edu.in?subject=${subject}&body=${body}`;

    // Redirect to the mailto link to open the Gmail compose window
    window.location.href = mailtoLink;
  };

  return (
    <div className="contact p-8">
      {/* Header Section */}
      <div className="address mb-6">
        <h1 id="title" className="text-4xl font-bold text-gray-900 mb-2">
          IEDC SNMIMT
        </h1>
        <p className="text-lg text-gray-700">
          Maliankara P.O, Moothankunnam, Ernakulam Dt. Kerala-683516, India
        </p>
      </div>
      <div id="line" className="border-b-2 border-gray-300 mb-8"></div>

      {/* Contact Form */}
      <h1 id="heading" className="text-3xl font-semibold text-gray-900 mb-4">
        Contact
      </h1>
      <form onSubmit={handleSubmit} className="form space-y-4">
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="enquiry"
          id="enquiry"
          placeholder="Your Enquiry"
          value={formData.enquiry}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </form>

      {/* Footer Section */}
      <div className="social mt-6 text-center text-gray-700">
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600"
          >
            <Facebook fontSize="large" />
          </a>
          <a
            href="https://www.instagram.com/iedc.snm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600"
          >
            <Instagram fontSize="large" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            <GitHub fontSize="large" />
          </a>
        </div>
        <span className="block text-sm mb-2">Terms of Service</span>
        <span className="block text-sm mb-2">Privacy</span>
        <span className="block text-sm text-gray-600">
          © IEDC-SNMIMT 2025-26. All rights reserved
        </span>
      </div>
    </div>
  );
}
