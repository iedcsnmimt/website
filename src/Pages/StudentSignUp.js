import React, { useState } from 'react';
import staffcss from '../css/staffsignup.module.css';
import upilogo from '../img/upi-logo.png';
import { auth, firestore, storage } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


function StudentSignupPage() {
  const navigate = useNavigate();
  const [cashOnHand, setCashOnHand] = useState(false);
  const [year, setYear] = useState('');
  

  const isPasswordValid = (password) => {
    // Password should be at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Password should contain at least one alphabet, one number, and one symbol
    const alphabetPattern = /[a-zA-Z]/;
    const numberPattern = /[0-9]/;
    const symbolPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

    return (
      alphabetPattern.test(password) &&
      numberPattern.test(password) &&
      symbolPattern.test(password)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = {
      username: event.target.username.value,
      firstname: event.target.firstname.value,
      lastname: event.target.lastname.value,
      email: event.target.mail.value,
      gmail: event.target.gmail.value,
      member: event.target.member.value,
      age: event.target.age.value,
      phone: event.target.phone.value,
      cashOnHand: cashOnHand,
      Branch: event.target.branch.value,
      year: event.target.year.value,
      bloodgroup: event.target.bloodgroup.value,
      hobbys: event.target.hobbys.value,
      fathername: event.target.fathername.value,
      fatherphnumber: event.target.fatherphnumber.value,
      mothername: event.target.mothername.value,
      motherphnumber: event.target.motherphnumber.value,
      guardianname: event.target.guardianname.value,
      guardianphnumber: event.target.guardianphnumber.value,
      hostel: event.target.hostel.value,
      ResidentialAddress: event.target.ResidentialAddress.value,
      KTUid: event.target.KTUid.value,
      Areaofinterset: event.target.Areaofinterset.value,
      yearofjoining: event.target.yearofjoining.value,
      skills: event.target.skills.value,
      iedcjoiningdate: event.target.iedcjoiningdate.value,
      posts: event.target.posts.value,
      password: event.target["userpassword"].value,
      passwordconfirm: event.target["userpasswordconfirm"].value,
      dob:event.target.dob.value,
      gender:event.target.gender.value

    };

    const confirmPassword = event.target["userpasswordconfirm"].value;

    // Check if password and confirm password match
    if (formData.password !== confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return; // Stop form submission
    }
  
    // Check if the password meets the requirements
    if (!isPasswordValid(formData.password)) {
      alert("Password must be at least 8 characters long and contain alphabets, numbers, and symbols.");
      return; // Stop form submission
    }
  
    try {
      // Create a new user account using Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
  
      // Get the newly created user's unique ID (UID)
      const userId = userCredential.user.uid;
  
      let downloadURL = null; // Initialize downloadURL
  
      if (!formData.cashOnHand) {
        // If not paying by cash, handle the file upload
        const paymentScreenshotInput = event.target.paymentScreenshot;
        if (paymentScreenshotInput && paymentScreenshotInput.files.length > 0) {
          const paymentScreenshot = paymentScreenshotInput.files[0];
  
          // Create a reference to the storage location
          const storageRef = storage.ref(`payment-screenshots/24-25/${userId}/${paymentScreenshot.name}`);
  
          // Upload the file
          const snapshot = await storageRef.put(paymentScreenshot);
  
          // Get the URL of the uploaded file
          downloadURL = await snapshot.ref.getDownloadURL();
        } else {
          console.error("Payment screenshot input not found or no file selected.");
          // You might want to show an error message to the user or take appropriate action.
        }
      }
  
      // Save user data to Firestore with the UID as the document ID
      await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(userId).set({
        ...formData,
        paymentScreenshotURL: downloadURL, // Store the URL
      });
  
      // Show a success message and redirect
      alert("Account created successfully!");
      navigate('/login/studentSignIn/1/'); // Redirect to the login page
    } catch (error) {
      console.error("Error creating user account:", error.message);
      alert("Error creating user account. Please try again.");
    }
  };

  return (
    <div className={staffcss['page-container']}>
      <main className={staffcss['card-container']}>
        <div className={staffcss['image-container']}>
          <h1 className={staffcss.company}>
            IEDC SNMIMT STUDENT MEMBERSHIP RENEWAL CLOSED
          </h1>
        </div>
        </main>
        </div>
  );
}

export default StudentSignupPage;
