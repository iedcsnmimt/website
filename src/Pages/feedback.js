import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios'; // Import the axios library
import '../css/feedback.css';

// Initialize Firebase with your config
const firebaseConfig = {
    // Your Firebase configuration...
    apiKey: "AIzaSyADzCR7t84JhxNaxv-pBvmtGQrLbmB4axE",
    authDomain: "iedcsnmimtadmin.firebaseapp.com",
    databaseURL: "https://iedcsnmimtadmin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iedcsnmimtadmin",
    storageBucket: "iedcsnmimtadmin.appspot.com",
    messagingSenderId: "1050421756481",
    appId: "1:1050421756481:web:9d12b833e2246c2fe3fcc0",
    measurementId: "G-TWWMQ2QTNM"
};

firebase.initializeApp(firebaseConfig);


const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [dept, setDept] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const [ipv4, setIpv4] = useState('Fetching IPv4...'); // Initialize ipv4 to a placeholder
  const [ipv6, setIpv6] = useState('Fetching IPv6...'); // Initialize ipv6 to a placeholder
  const [place, setPlace] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');


  useEffect(() => {
    // Fetch the user's IP address and location using axios
    axios.get('https://ipapi.co/json/')
      .then((response) => {
        setIpv4(response.data.ip || 'N/A');
        setPlace(response.data.city || 'N/A');
        setLocation(
          `${response.data.region || 'N/A'}, ${response.data.country_name || 'N/A'}`
        );
      })
      .catch((error) => {
        console.error('Error fetching IP address and location:', error);
        setIpv4('N/A');
        setPlace('N/A');
        setLocation('N/A');
      });

    // Try to fetch the IPv6 address using WebRTC
    const getIPv6 = () => {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((error) => console.error('Error fetching IPv6 address:', error));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          const ipv6Candidate = e.candidate.candidate.match(/([0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){7})/);
          if (ipv6Candidate) {
            setIpv6(ipv6Candidate[0]);
          } else {
            setIpv6('N/A');
          }
        }
      };
    };

    getIPv6();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a Firestore reference
    const db = firebase.firestore();

    // Add a new document with user feedback and IP location data
    await db.collection('feedback').add({
      name,
      email,
      year,
      dept,
      phone,
      feedback,
      ipv4,
      ipv6,
      place,
      location,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      rating,
    });

    // Reset the form fields after submission
    setName('');
    setEmail('');
    setYear('');
    setDept('');
    setPhone('');
    setFeedback('');
    setRating('');
    alert('Feedback submitted successfully!');
  };
  return (
    <Container>
      <h1>IEDC Feedback Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // This makes the field required
          />
        </Form.Group>
  
        <Form.Group controlId="year">
          <Form.Label>Year</Form.Label>
          <Form.Control
            as="select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required // This makes the field required
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </Form.Control>
        </Form.Group>
  
        <Form.Group controlId="dept">
          <Form.Label>Department</Form.Label>
          <Form.Control
            as="select"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            required // This makes the field required
          >
            <option value="">Select Department</option>
            <option value="CE">Civil Engineering</option>
            <option value="ECE">Electronics and Communication Engineering</option>
            <option value="EEE">Electrical and Electronics Engineering</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="CSE_AI">Computer Science Engineering (AI)</option>
            <option value="CSE_CYBER_SECURITY">Computer Science Engineering (Cyber Security)</option>
            <option value="ICE">Instrumentation and Control Engineering</option>
            <option value="ME">Mechanical Engineering</option>
          </Form.Control>
        </Form.Group>
  
        <Form.Group controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required // This makes the field required
          />
        </Form.Group>
  
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // This makes the field required
          />
        </Form.Group>
  
        <Form.Group controlId="feedback">
          <Form.Label>About IEDC</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Tell us about IEDC..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required // This makes the field required
          />
        </Form.Group>
  
        <Form.Group controlId="rating">
          <Form.Label>Rate the Program (out of 5)</Form.Label>
          <Form.Control
            as="select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required // This makes the field required
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Average</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </Form.Control>
        </Form.Group>
  
        <Button variant="primary" type="submit">
          Submit Feedback
        </Button>
      </Form>
    </Container>
  );
  
};

export default FeedbackForm;