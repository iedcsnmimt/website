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
      passwordconfirm: event.target["userpasswordconfirm"].value

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
          const storageRef = storage.ref(`payment-screenshots/${userId}/${paymentScreenshot.name}`);
  
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
      await firestore.collection('SNMIMT/USERS/STUDENTS').doc(userId).set({
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
    <div className={staffcss.container}>
      <div className={staffcss.header}>
        <title>Sign up | IEDC SNMIMT</title>
      </div>
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
                <input type="text" name="username" id="username" required />
                <span>
                  Username
                </span>
                <div class="error"></div>
              </div>


              <div className={staffcss["input-container"]}>
  <label htmlFor="mail"></label>
  <input
    type="email"
    name="mail"
    id="mail"
    required
    
    defaultValue="hi@iedcsnmimt.ds" // Add the defaultValue attribute
  />
  <span>IEDC SNMIMT-Mail</span>
  <div className="error"></div>
</div>


              <div className={staffcss["input-container"]}>

                <select name="member" id="member" required>

                  <option value="">Select Member Type</option>
                  <option value="new">New Member</option>
                  <option value="renewal">Renewal</option>
                </select>
                <div className="error"></div>
                <span>Whether Your Membership ? </span>
              </div>
              <div class={staffcss["input-container"]}>
                <label for="firstname"></label>
                <input type="text" name="firstname" id="firstname" required />
                <span>
                  First name
                </span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="lastname"></label>
                <input type="text" name="lastname" id="lastname" required />
                <span>
                  Last name
                </span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="age"></label>
                <input type="text" name="age" id="age" required />
                <span>
                  Age
                </span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="gmail">
                </label>
                <input type="email" name="gmail" id="gmail" required />
                <span>
                  Gmail ID
                </span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="phone">
                </label>
                <input type="tel" name="phone" id="phone" required />
                <span>Phone</span>
                <div class="error"></div>
              </div>



              <div className={staffcss["input-container"]}>

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
                <span>Branch</span>
              </div>


              <div className={staffcss["input-container"]}>

                <select name="year" id="year" required>

                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>


                </select>
                <div className="error"></div>
                <span>Which Year You Study ?</span>
              </div>
              <div class={staffcss["input-container"]}>
                <label for="bloodgroup">
                </label>
                <input type="text" name="bloodgroup" id="blood" required />
                <span>Blood Group</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="fathername">
                </label>
                <input type="text" name="fathername" id="fathername" required />
                <span>Father Name</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="fatherphnumber">
                </label>
                <input type="tel" name="fatherphnumber" id="fatherphnumber" required />
                <span>Father Phone Number</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="mothername">
                </label>
                <input type="text" name="mothername" id="mothername" required />
                <span>Mother Name</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="motherphnumber">
                </label>
                <input type="tel" name="motherphnumber" id="motherphnumber" required />
                <span>Mother Phone Number</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="guardianname">
                </label>
                <input type="text" name="guardianname" id="guardianname" required />
                <span>Guardian Name</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="guardianphnumber">
                </label>
                <input type="tel" name="guardianphnumber" id="guardianphnumber" required />
                <span>GuardianPhone Number</span>
                <div class="error"></div>
              </div>



              <div className={staffcss["input-container"]}>

                <select name="hostel" id="hostel" required>

                  <option value="">Select Any one of it</option>
                  <option value="hostel">Yes Iam in Hostel</option>
                  <option value="notinhostel">No iam not in hostel</option>



                </select>
                <div className="error"></div>
                <span>Hostel or not ?</span>
              </div>
              <div class={staffcss["input-container"]}>
                <label for="ResidentialAddress">
                </label>
                <input type="text" name="ResidentialAddress" id="ResidentialAddress" required />
                <span>Residential Address</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="KTUid">
                </label>
                <input type="text" name="KTUid" id="KTUid" required />
                <span>KTU-id</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="Areaofinterset">
                </label>
                <input type="text" name="Areaofinterset" id="Areaofinterset" required />
                <span>Area of interset Eg:Programming,Marketing,Video editing,Anchoring,etc</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="yearofjoining">
                </label>
                <input type="text" name="yearofjoining" id="yearofjoining" required />
                <span>Year Of Joining</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="iedcjoiningdate">
                </label>
                <input type="text" name="iedcjoiningdate" id="iedcjoiningdate" required />
                <span>IEDC JOINING YEAR</span>
                <div class="error"></div>
              </div>


              <div class={staffcss["input-container"]}>
                <label for="skills">
                </label>
                <input type="text" name="skills" id="skills" required />
                <span>skills</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="posts">
                </label>
                <input type="text" name="posts" id="posts" required />
                <span>Your Post</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="hobbys">
                </label>
                <input type="text" name="hobbys" id="hobbys" required />
                <span>Hobbys</span>
                <div class="error"></div>
              </div>



              <div class={staffcss["input-container"]}>
                <label for="userpassword"></label>
                <input type="password" name="userpassword" id="userpassword" class="user-password" required />
                <span>Password</span>
                <div class="error"></div>
              </div>

              <div class={staffcss["input-container"]}>
                <label for="user-password-confirm"></label>
                <input type="password" name="userpasswordconfirm" id="userpasswordconfirm" class="password-confirmation" required />
                <span>
                  Confirm Password
                </span>
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
                        <span>bijusasi9446@okaxis</span>
                       
                        <img
                          src={upilogo}  // Replace with the actual path to your image
                          alt="Google Pay UPI Symbol"
                          className={staffcss["upi-symbol"]}
                        />
                        
                      </div>
                      <span style={{ fontWeight: 'bold',fontSize: '18px' }}>GPay Number = 9446220354</span>

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
                    <li>Renewal: Rs. 30</li>
                    <li>"For third-year students who are not yet IEDC members and wish to join, there will be an additional fine of Rs. 100."</li>

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
    </div>
  );
}

export default StudentSignupPage;
