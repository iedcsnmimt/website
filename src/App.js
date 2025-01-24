import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, firestore, analytics } from './firebaseConfig';
import Staffsignuppage from './Pages/StaffSiginUp';
import StudentSignupPage from './Pages/StudentSignUp';
import StaffLogin from './Pages/StaffSignIn';
import StudentLogin from './Pages/StudentSignIn';
import StudentDashboard from './Pages/StudentDashboard';
import StaffDashboard from './Pages/StaffDashboard';
import Login from './Pages/Login';
import Home from './Pages/home';
import FeedbackForm from './Pages/feedback';
import StudentRenewalPage from './Pages/studentrevenvalsignup';
import Startup from './Pages/StartupList';
import './App.css';

function App() {
  // Check local storage for initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-SGGFRP8HCW';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-SGGFRP8HCW');

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Persist login state

        // Check the user's role in Firestore
        const checkUserRole = async () => {
          try {
            const userDoc = await firestore.collection('SNMIMT/USERS/STAFFS').doc(user.uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              const role = userData.designation;
              setUserRole(role);
            }
          } catch (error) {
            console.error(error);
          }
        };
        checkUserRole();
      } else {
        setIsAuthenticated(false);
        setUserRole('');
        localStorage.removeItem('isAuthenticated'); // Clear login state on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/staffSignUp/0/" element={<Staffsignuppage />} />
          <Route path="/login/studentSignUp/0/" element={<StudentSignupPage />} />
          <Route path="/Signup/studentRevenalSignUp/0/" element={<StudentRenewalPage />} />
          <Route path="/login/staffSignIn/1/" element={<StaffLogin />} />
          <Route path="/login/studentSignIn/1/" element={<StudentLogin />} />
          <Route path="/feedback/" element={<FeedbackForm />} />
          <Route path="/startuplist/" element={<Startup />} />
          <Route
            path="/dashboard/student"
            element={5==5 ? <StudentDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard/staff"
            element={5==5 ? <StaffDashboard /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY);

export default App;
