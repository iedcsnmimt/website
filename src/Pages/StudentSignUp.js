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
    <div>
  <main className={staffcss['card-container']}>
    <div className={staffcss['image-container']}>
      <h1 className={staffcss.company}>
        IEDC SNMIMT STUDENTS REGISTRATION FORM
      </h1>

      {/* Add the Download Rules Book PDF button */}
      <a
  href="https://drive.google.com/file/d/1iw-2g4VxrKilQ-j5l_N-J743bKfPj3Zf/view?usp=sharing"
  download="rules-book.pdf"
  className={`${staffcss["download-button"]} ${staffcss["mobile-button"]}`} /* Add the mobile-button class */
>
  Download Rules Book PDF
</a>

    </div> 
          <form onSubmit={handleSubmit}>
            <div className={staffcss['form-container']}>


              <div class={staffcss["input-container"]}>
                <label for="Username"></label>
                <span>
                  Username
                </span>
                <input type="text" name="username" id="username" required />
                
                <div class="error"></div>
              </div>


              <div className={staffcss["input-container"]}>
  <label htmlFor="mail"></label>
  <span>IEDC SNMIMT-Mail</span>
  <input
    type="email"
    name="mail"
    id="mail"
    required
    
    defaultValue="YourFullName@iedcsnmimt.ds" // Add the defaultValue attribute
  />
 
  <div className="error"></div>
</div>


<div className={staffcss["input-container"]}>
  <span>Whether Your Membership?</span>
  <select name="member" id="member" required>
    <option value="">Select Member Type</option>
    <option value="new">New Member</option>
    <option value="renewal" disabled>Renewal</option>
  </select>
  <div className="error"></div>
</div>

              <div class={staffcss["input-container"]}>
              <span>
                  First name
                </span>
                <label for="firstname"></label>
                <input type="text" name="firstname" id="firstname" required />
                
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>
                  Last name
                </span>
                <label for="lastname"></label>
                <input type="text" name="lastname" id="lastname" required />
                
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>
                  Age
                </span>
                <label for="age"></label>
                <input type="text" name="age" id="age" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>
                  Gmail ID
                </span>
                <label for="gmail">
                </label>
                <input type="email" name="gmail" id="gmail" required />
                
                <div class="error"></div>
              </div>
  {/* Date of Birth */}
  <div className={staffcss["dob-input"]}>
  <span>Date of Birth</span>
  <input type="date" name="dob" id="dob" required />
  <div className="error"></div>
</div>


            {/* Gender */}
            <div class={staffcss["input-container"]}>
              <span>Gender</span>
              <select name="gender" id="gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              <div class="error"></div>
            </div>

              <div class={staffcss["input-container"]}>
              <span>Phone</span>
                <label for="phone">
                </label>
                <input type="tel" name="phone" id="phone" required />
               
                <div class="error"></div>
              </div>



              <div className={staffcss["input-container"]}>
              <span>Branch</span>
                <select name="branch" id="branch" required>

                  <option value="">Select Branch</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="CSE">CSE</option>
                  <option value="CSE-AI">CSE-AI</option>
                  <option value="CSE-CB">CSE -CYBER SERCURITY</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="ICE">ICE</option>
                  <option value="ME">ME</option>

                </select>
                <div className="error"></div>
              
              </div>


              <div className={staffcss["input-container"]}>
              <span>Which Year You Study ?</span>
                <select name="year" id="year" required>

                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4" disabled>Fourth Year</option>


                </select>
                <div className="error"></div>
               
              </div>
              <div class={staffcss["input-container"]}>
              <span>Blood Group</span>
                <label for="bloodgroup">
                </label>
                <input type="text" name="bloodgroup" id="blood" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>Father Name</span>
                <label for="fathername">
                </label>
                <input type="text" name="fathername" id="fathername" required />
               
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>Father Phone Number</span>
                <label for="fatherphnumber">
                </label>
                <input type="tel" name="fatherphnumber" id="fatherphnumber" required />
                
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>Mother Name</span>
                <label for="mothername">
                </label>
                <input type="text" name="mothername" id="mothername" required />
                
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>Mother Phone Number</span>
                <label for="motherphnumber">
                </label>
                <input type="tel" name="motherphnumber" id="motherphnumber" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>Guardian Name</span>
                <label for="guardianname">
                </label>
                <input type="text" name="guardianname" id="guardianname" required />
               
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>Guardian Phone Number</span>
                <label for="guardianphnumber">
                </label>
                <input type="tel" name="guardianphnumber" id="guardianphnumber" required />
                
                <div class="error"></div>
              </div>



              <div className={staffcss["input-container"]}>
              <span>Hostel or not ?</span>
                <select name="hostel" id="hostel" required>

                  <option value="">Select Any one of it</option>
                  <option value="hostel">Yes I am in Hostel</option>
                  <option value="notinhostel">No I am not in hostel</option>



                </select>
                <div className="error"></div>
               
              </div>
              <div class={staffcss["input-container"]}>
              <span>Residential Address</span>
                <label for="ResidentialAddress">
                </label>
                <input type="text" name="ResidentialAddress" id="ResidentialAddress" required />

                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>KTU-id</span>
                <label for="KTUid">
                </label>
                <input type="text" name="KTUid" id="KTUid" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>Area of interset Eg:Programming,Marketing,Video editing,Anchoring,etc</span>
                <label for="Areaofinterset">
                </label>
                <input type="text" name="Areaofinterset" id="Areaofinterset" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>Year Of Joining</span>
                <label for="yearofjoining">
                </label>
                <input type="text" name="yearofjoining" id="yearofjoining" required />
               
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>IEDC JOINING YEAR</span>
                <label for="iedcjoiningdate">
                </label>
                <input type="text" name="iedcjoiningdate" id="iedcjoiningdate" required />
               
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
              <span>skills</span>
                <label for="skills">
                </label>
                <input type="text" name="skills" id="skills" required />
              
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>Your Post</span>
                <label for="posts">
                </label>
                <input type="text" name="posts" id="posts" required  defaultValue="NO POST" />
                
                <div class="error"></div>
               
              </div>

              <div class={staffcss["input-container"]}>
              <span>Hobbys</span>
                <label for="hobbys">
                </label>
                <input type="text" name="hobbys" id="hobbys" required />
              
                <div class="error"></div>
              </div>



              <div class={staffcss["input-container"]}>
              <span>Password</span>
                <label for="userpassword"></label>
                <input type="password" name="userpassword" id="userpassword" class="user-password" required />
               
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
              <span>
                  Confirm Password
                </span>
                <label for="user-password-confirm"></label>
                <input type="password" name="userpasswordconfirm" id="userpasswordconfirm" class="password-confirmation" required />
               
                <div class="error"></div>
              </div>

              <section className={`${staffcss["payment-section"]} ${staffcss["wider-section"]}`}>
                <h2>Type of Payment: Online or Cash</h2>
                <div className={`${staffcss["input-container"]} ${staffcss["cash-on-hand-container"]}`}>
                  <input
                    type="checkbox"
                    name="cashOnHand"
                    id="cashOnHand"
                    checked={cashOnHand}
                    onChange={(e) => setCashOnHand(e.target.checked)}
                  />
                  <label htmlFor="cashOnHand">Cash on Hand</label>
                  <div className="error"></div>
                </div>

                {cashOnHand ? (
                  null
                ) : (
                  <>
                    <div className={staffcss["input-container"]}>
                      <label>
                        <strong>Google Pay UPI ID</strong>
                      </label>
                      <div className={staffcss["upi-container"]}>
                      <span>anjithbineesh@okhdfcbank</span>
                       
                        <img
                          src={upilogo}  // Replace with the actual path to your image
                          alt="Google Pay UPI Symbol"
                          className={staffcss["upi-symbol"]}
                        />
                        
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>GPay Number = 8593844084</span>

                    </div>

                    <div className={staffcss["input-container"]}>
                      <label htmlFor="paymentScreenshot"></label>
                      <input
                        type="file"
                        name="paymentScreenshot"
                        id="paymentScreenshot"
                        accept="image/*"
                      />
                      <span>"Please attach your payment screenshot with your name, department, and year."</span>
                      <div className="error"></div>
                    </div>
                  </>
                )}

                <div className={staffcss["fee-rules"]}>
                  <h3>Membership Fee Rules:</h3>
                  <ul>
                    <li>New Members: Rs. 50</li>
                    <li>"For third-year students who are not yet IEDC members and wish to join, there will be an additional fine of Rs. 100."</li>
                    <li>"Fourth Years Only Renewal Is Permitted."</li>


                  </ul>
                </div>
              </section>


            </div>
            <div id="btm">
              <button type="submit" class={staffcss["submit-btn"]}>Create Account</button>

            </div>
          </form>

        </main>
        <section className={staffcss['outro-overlay']}>

          <h1 className={staffcss['outro-greeting']}>signing up..!</h1>


        </section> 
      </div>

  );
}

export default StudentSignupPage;
