import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Avatar,
  Typography,
  Button,
  AppBar,
  Tabs,
  Tab,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { auth, firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../css/studentdashboard.css'; // Ensure this CSS file contains the custom styles

function StudentDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [studentList] = useState([]);

  const [showUploadButton, setShowUploadButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [latestEvents, setLatestEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [value, setValue] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false); // Add isAdmin state

  const filteredStudentList = studentList.filter(student => {
    const searchLower = searchTerm.toLowerCase();
     
    return (
      (student.firstname && student.firstname.toLowerCase().includes(searchLower)) ||
      (student.year && student.year.toLowerCase().includes(searchLower)) ||
      (student.Branch && student.Branch.toLowerCase().includes(searchLower))
    );
  });


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const [editedData, setEditedData] = useState({
    gmail: '',
    phone: '',
    fatherphnumber: '',
    motherphnumber: '',
    year: '',
    posts: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(user.uid).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserData(userData);
            setIsAdmin(userData.posts === 'CEO' || userData.posts === 'CCO');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData && (userData.posts === 'CEO' || userData.posts === 'CCO')) {
      setShowUploadButton(true);
    } else {
      setShowUploadButton(false);
    }
  }, [userData]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await firestore.collection('events').orderBy('timestamp', 'desc').get();
        const eventsData = eventsSnapshot.docs.map(doc => doc.data());
        setLatestEvents(eventsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const notificationsSnapshot = await firestore.collection('notifications').where('recipientId', '==', user.uid).get();
          const notificationsData = notificationsSnapshot.docs.map(doc => doc.data());
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
    setEditedData({
      gmail: userData.gmail,
      phone: userData.phone,
      fatherphnumber: userData.fatherphnumber,
      motherphnumber: userData.motherphnumber,
      year: userData.year,
      posts: userData.posts,
    });
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(user.uid).update({
          gmail: editedData.gmail,
          phone: editedData.phone,
          fatherphnumber: editedData.fatherphnumber,
          motherphnumber: editedData.motherphnumber,
          year: editedData.year,
          posts: editedData.posts,
        });

        const updatedUserDoc = await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(user.uid).get();
        if (updatedUserDoc.exists) {
          setUserData(updatedUserDoc.data());
          setEditMode(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleEventSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await firestore.collection('SNMIMT/EVENTS').add({
          title: eventName,
          date: eventDate,
          description: eventDesc,
          time: eventTime,
          location: eventVenue,
          timestamp: new Date(),
          createdBy: user.uid,
        });
        alert('Event created successfully!');
        // Clear form fields after successful submission
        setEventName('');
        setEventDate('');
        setEventTime('');
        setEventVenue('');
        setEventDesc('');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create event. Please check the console for details.');
    }
  };




  const handleExport = async () => {
    try {
      // Fetch all student data from Firestore
      const studentsSnapshot = await firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').get();
      const studentsData = studentsSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Format data for export
      const formattedData = studentsData.map(student => ({
        'First Name': student.firstname,       // Use Firestore field names
        'Last Name': student.lastname,         // Use Firestore field names
        'Branch': student.Branch,              // Assuming this field exists
        'Year': student.year,                  // Assuming this field exists
        'Dept': student.Branch,
        'phone number': student.phone,
        'member status': student.member,
        'payment status': student.paymentScreenshotURL,
        'Activity Points': student.activityPoints, // Assuming this field exists
      }));



      // Add headers to the data
      const completeData = [...formattedData];

      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(completeData, { skipHeader: false });

      // Create a workbook and add the worksheet to it
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Points');

      // Convert workbook to binary and create a Blob for downloading
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      // Generate a download link for the Excel file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'activity_points.xlsx';
      link.click();
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please check the console for details.');
    }
  };




  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Avatar sx={{ width: 80, height: 80, margin: 'auto' }}>
              <AccountCircleIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h5" align="center" sx={{ marginTop: 2 }}>
             Hai,{userData?.firstname || 'First Name'} {userData?.lastname || 'Last Name'}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              {userData?.email || 'email@example.com'}
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
             Status: {userData?.posts || 'Member'}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Profile" icon={<AccountCircleIcon />} />
                <Tab label="Events" icon={<EventIcon />} />
                <Tab label="Notifications" icon={<NotificationsIcon />} />
                <Tab label="Settings" icon={<SettingsIcon />} />
              </Tabs>
            </AppBar>
            <Box p={3}>
              {value === 0 && (
                <Box>
                  {editMode ? (
                    <Box>
                      <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={editedData.gmail}
                        onChange={(e) =>
                          setEditedData({ ...editedData, gmail: e.target.value })
                        }
                      />
                      <TextField
                        label="Phone"
                        fullWidth
                        margin="normal"
                        value={editedData.phone}
                        onChange={(e) =>
                          setEditedData({ ...editedData, phone: e.target.value })
                        }
                      />
                      <TextField
                        label="Father's Phone"
                        fullWidth
                        margin="normal"
                        value={editedData.fatherphnumber}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            fatherphnumber: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Mother's Phone"
                        fullWidth
                        margin="normal"
                        value={editedData.motherphnumber}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            motherphnumber: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Year"
                        fullWidth
                        margin="normal"
                        value={editedData.year}
                        onChange={(e) =>
                          setEditedData({ ...editedData, year: e.target.value })
                        }
                      />
                      <TextField
                        label="Posts"
                        fullWidth
                        margin="normal"
                        value={editedData.posts}
                        onChange={(e) =>
                          setEditedData({ ...editedData, posts: e.target.value })
                        }
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6">Email: {userData?.gmail}</Typography>
                      <Typography variant="h6">Phone: {userData?.phone}</Typography>
                      <Typography variant="h6">
                        Father's Phone: {userData?.fatherphnumber}
                      </Typography>
                      <Typography variant="h6">
                        Mother's Phone: {userData?.motherphnumber}
                      </Typography>
                      <Typography variant="h6">Year: {userData?.year}</Typography>
                      <Typography variant="h6">Branch: {userData?.Branch}</Typography>
                      <Typography variant="h6">Posts: {userData?.posts}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleEdit}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {value === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Latest Events
                  </Typography>
                  <List>
                    {latestEvents.map((event, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={event.title}
                            secondary={`${event.date} | ${event.time} | ${event.location}`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                  {isAdmin && (
                    <Box mt={3}>
                      <Typography variant="h6" gutterBottom>
                        Create New Event
                      </Typography>
                      <TextField
                        label="Event Name"
                        fullWidth
                        margin="normal"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                      <TextField
                        label="Event Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                      <TextField
                        label="Event Time"
                        type="time"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                      <TextField
                        label="Event Venue"
                        fullWidth
                        margin="normal"
                        value={eventVenue}
                        onChange={(e) => setEventVenue(e.target.value)}
                      />
                      <TextField
                        label="Event Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleEventSubmit}
                      >
                        Create Event
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {value === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <List>
                    {notifications.map((notification, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText primary={notification.message} />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}
              {value === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Settings
                  </Typography>
                  Coming Soon New Updates
                  {isAdmin && (
                    <Box mt={3}>
                      {showUploadButton && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExport}
                    >
                      Export Data
                    </Button>
                  )}
                      <Typography variant="h6" gutterBottom>
                        Student List
                      </Typography>
                      <TextField
                        label="Search Students"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>First Name</TableCell>
        <TableCell>Last Name</TableCell>
        <TableCell>Year</TableCell>
        <TableCell>Branch</TableCell>
        <TableCell>Activity Points</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredStudentList.map((student, index) => (
        <TableRow key={index}>
          <TableCell>{student.firstname}</TableCell>
          
          <TableCell>{student.lastname}</TableCell>
          <TableCell>{student.year}</TableCell>
          <TableCell>{student.Branch}</TableCell>
          <TableCell>{student.activityPoints}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
  
}

export default StudentDashboard;
