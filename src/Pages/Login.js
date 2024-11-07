import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import backgroungIMG from '../img/starting.webp';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import Firebase auth
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, redirect to dashboard
        navigate('/dashboard/student'); // or '/dashboard/staff' based on role
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNodalLogin = async () => {
    try {
      navigate('/login/staffSignin/1/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentLogin = () => {
    try {
      navigate('/login/studentSignin/1/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={6} style={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          IEDC SNMIMT LOGIN PAGE
        </Typography>
        <Paper
          elevation={5}
          style={{
            padding: '30px',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNodalLogin}
            style={{ marginBottom: '20px' }}
          >
            Nodal Officers
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleStudentLogin}
          >
            Students
          </Button>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        className="background-image"
        style={{
          position: 'relative',
          boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.7)',
        }}
      >
        <img
          src={backgroungIMG}
          alt="Login Image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            filter: 'blur(0.01px)',
            animation: 'colorfulShadow 5s linear infinite',
            boxShadow: '20px 0px 20px rgba(255, 0, 0, 0.7)',
          }}
        />
      </Grid>
    </Grid>
  );
}

export default Login;
