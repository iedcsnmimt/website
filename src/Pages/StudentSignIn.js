import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebaseConfig';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import '../css/studentsignin.css';
import { Box } from '@mui/material';

function StudentLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(username, password);
      const user = userCredential.user;

      // Assuming user data is stored in the "SNMIMT/USERS/STUDENTS" collection
      const userDoc = await firestore.collection('SNMIMT/USERS/STUDENTS').doc(user.uid).get();

      if (userDoc.exists) {
        navigate('/dashboard/student'); // Redirect to the student dashboard on successful login
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again."); // Set the error message
    }
  };

  return (
    <div className="student-login-container">
      <div className="background"></div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          maxWidth: '400px',
          margin: 'auto',
        }}
      >
        <div className="content">
          <Typography variant="h4" className="title" sx={{ textAlign: 'center', marginBottom: '20px' }}>
            IEDC SNMIMT Students Login
          </Typography>
          <div className="form">
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{
                borderRadius: '10px',
                marginTop: '20px',
                padding: '10px 0',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              }}
            >
              Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ marginTop: '16px' }}>
                {error}
              </Alert>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
}

export default StudentLogin;
