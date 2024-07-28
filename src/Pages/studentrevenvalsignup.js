import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import staffcss from '../css/staffsignup.module.css';
import upilogo from '../img/upi-logo.png';
import { firestore, storage } from '../firebaseConfig';

function StudentRenewalPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [cashOnHand, setCashOnHand] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [isRenewed, setIsRenewed] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsSnapshot = await firestore.collection('SNMIMT/USERS/STUDENTS').get();
        const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    setSelectedStudent(studentId);
    const student = students.find(s => s.id === studentId);
    setStudentData(student);
    setGender(student?.gender || ''); // Set gender if available
    setPassword(''); // Reset password input
    setStoredPassword(student?.password || ''); // Set stored password if available

    // Check if the student has already renewed
    if (studentId) {
      try {
        const renewalDoc = await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(studentId).get();
        if (renewalDoc.exists) {
          setIsRenewed(true);
        } else {
          setIsRenewed(false);
        }
      } catch (error) {
        console.error("Error checking renewal status:", error.message);
      }
    } else {
      setIsRenewed(false);
    }
  };

  const incrementYear = (year) => {
    const numericYear = parseInt(year, 10);
    if (numericYear < 4) {
      return (numericYear + 1).toString(); // Return the incremented year as a string
    }
    return year.toString(); // Ensure the year is returned as a string
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    if (isRenewed) {
      alert("You have already renewed your membership for the 2024-25 period.");
      return;
    }

    if (parseInt(studentData.year, 10) >= 4) {
      alert("Renewal not allowed after fourth-year students.");
      return;
    }

    if (password !== storedPassword) {
      alert("Incorrect password. Please try again.");
      return;
    }

    const paymentScreenshotInput = event.target.paymentScreenshot;
    let downloadURL = null;

    if (!cashOnHand && paymentScreenshotInput && paymentScreenshotInput.files.length > 0) {
      const paymentScreenshot = paymentScreenshotInput.files[0];
      const storageRef = storage.ref(`payment-screenshots/24-25/${selectedStudent}/${paymentScreenshot.name}`);
      const snapshot = await storageRef.put(paymentScreenshot);
      downloadURL = await snapshot.ref.getDownloadURL();
    }

    try {
      const updatedStudentData = {
        ...studentData,
        renewalDate: new Date(),
        paymentScreenshotURL: downloadURL,
        year: incrementYear(studentData.year), // Increment the year here
        gender: gender,
      };

      // Update the student data in the original location
      await firestore.collection('SNMIMT/USERS/STUDENTS').doc(selectedStudent).update(updatedStudentData);

      // Save the renewed student data to the new location
      await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(selectedStudent).set(updatedStudentData);

      alert("Membership renewed successfully!");
      navigate('/login/studentSignIn/1/');
    } catch (error) {
      console.error("Error renewing membership:", error.message);
      alert("Error renewing membership. Please try again.");
    }
  };

  return (
    <div>
      <main className={staffcss['card-container']}>
        <div className={staffcss['image-container']}>
          <h1 className={staffcss.company}>
            IEDC SNMIMT STUDENT MEMBERSHIP RENEWAL
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={staffcss['form-container']}>
            <div className={staffcss["input-container"]}>
              <label htmlFor="student"></label>
              <span>Select Student</span>
              <select name="student" id="student" value={selectedStudent} onChange={handleStudentChange} required>
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstname} {student.lastname}
                  </option>
                ))}
              </select>
              <div className="error"></div>
            </div>

            {studentData && (
              <>
                {isRenewed ? (
                  <div className={staffcss["renewal-message"]}>
                    <p>You have already renewed your membership for the 2024-25 period.</p>
                  </div>
                ) : (
                  <>
                    <div className={staffcss["input-container"]}>
                      <label htmlFor="email"></label>
                      <span>Gmail ID</span>
                      <input type="email" name="email" id="email" value={studentData.gmail} readOnly />
                      <div className="error"></div>
                    </div>
                    <div className={staffcss["input-container"]}>
                      <label htmlFor="email"></label>
                      <span>IEDC MAIL ID</span>
                      <input type="email" name="mail" id="mail" value={studentData.email} readOnly />
                      <div className="error"></div>
                    </div>
                    <div className={staffcss["input-container"]}>
                      <label htmlFor="year"></label>
                      <span>Year</span>
                      <input type="text" name="year" id="year" value={studentData.year} readOnly />
                      <div className="error"></div>
                    </div>
                    <div className={staffcss["input-container"]}>
                      <label htmlFor="password"></label>
                      <span>Current Password</span>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="error"></div>
                    </div>
                    <div className={staffcss["input-container"]}>
                      <label htmlFor="gender"></label>
                      <span>Gender</span>
                      <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="error"></div>
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
                                src={upilogo}
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
                          <li>Renewal: Rs. 30</li>
                          <li>"For third-year students who are not yet IEDC members and wish to join, there will be an additional fine of Rs. 100."</li>
                          <li>"Fourth Years Only Renewal Is Permitted."</li>
                        </ul>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
          {!isRenewed && (
            <div id="btm">
              <button type="submit" className={staffcss["submit-btn"]}>Renew Membership</button>
            </div>
          )}
        </form>
      </main>
      <section className={staffcss['outro-overlay']}>
        <p className={staffcss['outro']}>Back to <a href="/">Home</a></p>
      </section>
    </div>
  );
}

export default StudentRenewalPage;
