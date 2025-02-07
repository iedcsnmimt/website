import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebaseConfig";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import "../css/StaffLogin.css"; // Import your CSS file

function StaffLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        username,
        password
      );
      const user = userCredential.user;

      // Assuming user data is stored in the "SNMIMT/USERS/STAFFS" collection
      const userDoc = await firestore
        .collection("SNMIMT/USERS/STAFFS")
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        navigate("/dashboard/staff"); // Redirect to the staff dashboard on successful login
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <h1>NODAL OFFICER Login</h1>
      <input
        type="email"
        value={username}
        id="text"
        placeholder="Email ID"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        id="text"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && (
        <Alert severity="error" style={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}
    </>
    // <div className="staff-login-container">
    //   <div className="background"></div>
    //   <Container maxWidth="xs" className="content">
    //     <Typography variant="h4" align="center" gutterBottom className="staff-login-title">
    //       IEDC NODAL OFFICER Login Page
    //     </Typography>
    //     <TextField
    //       label="Email ID"
    //       type="email"
    //       fullWidth
    //       margin="normal"
    //       variant="outlined"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //     <TextField
    //       label="Password"
    //       type="password"
    //       fullWidth
    //       margin="normal"
    //       variant="outlined"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <Button
    //       variant="contained"
    //       color="primary"
    //       fullWidth
    //       onClick={handleLogin}
    //     >
    //       Login
    //     </Button>
    // {error && (
    //   <Alert severity="error" style={{ marginTop: '16px' }}>
    //     {error}
    //   </Alert>
    // )}
    //   </Container>
    // </div>
  );
}

export default StaffLogin;
