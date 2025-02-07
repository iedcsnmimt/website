import React, { useState, useEffect } from 'react';
import '../css/staffdashboard.css';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { firestore, auth ,storage} from '../firebaseConfig';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../css/staffdashboard.css';
import * as XLSX from 'xlsx';


// Define tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <div>{children}</div>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};




function StaffDashboard() {
  
  const navigate = useNavigate;
  const [staffData, setStaffData] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedPosts, setAssignedPosts] = useState({});
  const [showStudentList, setShowStudentList] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  
  const [editingEvent, setEditingEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchActive(query.trim() !== ''); // Set isSearchActive to true if the query is not empty
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
        'Branch': student.branch,              // Assuming this field exists
        'Year': student.year,                  // Assuming this field exists
        'Phone':student.phone,
        'renewalDate':student.renewalDate,
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

  const performSearch = () => {
    const filteredStudents = students.filter((student) => {
      const { firstname, lastname, Branch, year } = student;
      const queryLower = searchQuery.toLowerCase();
  
      return (
        firstname.toLowerCase().includes(queryLower) ||
        lastname.toLowerCase().includes(queryLower) ||
        Branch.toLowerCase().includes(queryLower) ||
        year.toLowerCase().includes(queryLower) 
        
      );
    });
  
    setSearchResults(filteredStudents);
    console.log('Filtered Students:', filteredStudents); // Add this for debugging
  };
  

  useEffect(() => {
    performSearch();
  }, [searchQuery]);

  useEffect(() => {
    const eventsRef = firestore.collection('events');
    eventsRef
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get()
      .then((querySnapshot) => {
        const eventsData = [];
        querySnapshot.forEach((doc) => {
          const event = doc.data();
          eventsData.push(event);
        });
        setEvents(eventsData);
      })
      .catch((error) => {
        console.log('Error getting events:', error);
      });

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const staffRef = firestore.collection('SNMIMT/USERS/STAFFS').doc(userId);

      staffRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setStaffData(doc.data());
          } else {
            console.log('No such document!');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log('Error getting staff document:', error);
          setLoading(false);
        });

      const studentsRef = firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS');
      studentsRef
        .get()
        .then((querySnapshot) => {
          const studentList = [];
          querySnapshot.forEach((doc) => {
            const student = doc.data();
            student.uid = doc.id;
            studentList.push(student);
          });
          setStudents(studentList);
          setTotalStudents(studentList.length);
        })
        .catch((error) => {
          console.log('Error getting student list:', error);
        });
    }
  }, []);

  const handleShowStudentList = () => {
    setShowStudentList(!showStudentList);
  };

  const handlePostAssignment = (studentUid, selectedPost) => {
    setAssignedPosts((prevState) => ({
      ...prevState,
      [studentUid]: selectedPost,
    }));
  };

  const handleSavePosts = async () => {
    try {
      const batch = firestore.batch();

      Object.keys(assignedPosts).forEach((studentUid) => {
        const studentRef = firestore.collection('SNMIMT/USERS/2024-25/REV/STUDENTS').doc(studentUid);
        batch.update(studentRef, { posts: assignedPosts[studentUid] });
      });

      await batch.commit();
      alert('Assigned posts have been saved successfully.');
    } catch (error) {
      console.error('Error updating Firestore:', error);
      alert('Failed to save assigned posts. Please check the console for details.');
    }
  };


  

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handleEventDateChange = (e) => {
    setEventDate(e.target.value);
  };

  const handleEventTimeChange = (e) => {
    setEventTime(e.target.value);
  };

  const handleEventVenueChange = (e) => {
    setEventVenue(e.target.value);
  };

  const handleRegistrationLinkChange = (e) => {
    setRegistrationLink(e.target.value);
  };

  const handleSubmitEvent = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
         // Create a new event document in Firestore
         const eventsRef = firestore.collection('events'); // Replace with the actual collection name
         await eventsRef.add({
           title: eventName,
           date: eventDate,
           description: eventDesc, // Store the event description
           time: eventTime,
           location: eventVenue,
           registrationLink: registrationLink,
           timestamp: new Date(),
           createdBy: user.uid, // You can store the NODAL OFFICER's UID
         });

        // Clear the form fields after submitting
        setEventName('');
        setEventDate('');
        setEventTime('');
        setEventVenue('');
        setEventDesc('');
        setRegistrationLink(''); // Clear the registration link field

        alert('Event created successfully!');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create the event. Please check the console for details.');
    }
  };



// Function to delete an event document by ID
const deleteEventById = async (eventId) => {
  try {
    // Create a reference to the event document in Firestore
    const eventRef = firestore.collection('events').doc(eventId).delete();

    // Delete the event document
    await eventRef.delete();

    alert('Event deleted successfully!');
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete the event. Please check the console for details.');
  }
};

// Modify the handleConfirmDeleteEvent function to delete the event by ID
const handleConfirmDeleteEvent = () => {
  // Close the confirmation dialog
  setConfirmDialogOpen(false);

  // Call the function to delete the event by ID
  deleteEventById(deleteEventId);
};

// Modify the handleDeleteEvent function to open the confirmation dialog
const handleDeleteEvent = (eventId) => {
  setConfirmDialogOpen(true); // Open the confirmation dialog
  setDeleteEventId(eventId); // Set the eventId to be deleted
};
  


const handleLogout = async () => {
  try {
    await auth.signOut();
    navigate('/login/student/1');
  } catch (error) {
    console.error(error);
  }
};

//STYLES
// Function to handle tab change
const handleTabChange = (event, newValue) => {
  setCurrentTab(newValue);
};


  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  return (
    <Container className="py-6 px-4 staff-dashboard">
   <Typography variant="h4" sx={{ color: 'black', marginBottom: '1.5rem' }}>
  Welcome, {staffData.firstname} {staffData.lastname}!
</Typography>

<Typography sx={{ color: 'black' }} className='welcome-text'>Email: {staffData.email}</Typography>
<Typography sx={{ color: 'black' }}>Designation: {staffData.designation}</Typography>
<Typography sx={{ color: 'black' }}>Branch: {staffData.Branch}</Typography>
<Typography sx={{ color: 'black' }}>Phone: {staffData.phone}</Typography>
<Typography sx={{ color: 'black' }}>KTU ID: {staffData.KTUid}</Typography>
<Typography sx={{ color: 'black' }}>Total Students: {totalStudents}</Typography>

      {/* Tabs for different sections */}
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="User Info" />
        <Tab label="Student List" />
        <Tab label="Create Event" />
        <Tab label="Event Cards" />
      </Tabs>
      <Button
            variant="contained"
            color="primary"
            className="small-button"
            onClick={handleShowStudentList}
          >
        {showStudentList ? 'Hide Student List' : 'Show Student List'}
      </Button>
      {/* Tab Panels */}
      <TabPanel  index={0} value={currentTab}
        onChange={handleTabChange}
        centered
        variant="fullWidth" // Add this variant to create a gap between tabs
        sx={{ marginBottom: 10 }}>
      {/* User Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper className="p-4 mb-4">
            <Typography>Email: {staffData.email}</Typography>
            <Typography>Designation: {staffData.designation}</Typography>
            <Typography>Branch: {staffData.Branch}</Typography>
            <Typography>Phone: {staffData.phone}</Typography>
            <Typography>KTU ID: {staffData.KTUid}</Typography>
          </Paper>
        </Grid>
        </Grid>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
        <Grid item xs={12} md={6} lg={8}>
          
</Grid>
<div className="mb-4">
  <Typography variant="h5" className="mb-2">
    Create Event
  </Typography>
  <form className="event-form">
    <TextField
      label="Event Name"
      value={eventName}
      onChange={handleEventNameChange}
    />
    <TextField
      label="Event Date"
      type="date"
      value={eventDate}
      onChange={handleEventDateChange}
    />
    <TextField
      label="Event Time"
      type="time"
      value={eventTime}
      onChange={handleEventTimeChange}
    />
    <TextField
      label="Event Description"
      value={eventVenue}
      onChange={handleEventVenueChange}
    />
    <TextField
      label="Registration Link"
      value={registrationLink}
      onChange={handleRegistrationLinkChange}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmitEvent}
    >
      Create Event
    </Button>
  </form>
</div>

</TabPanel> 
<TabPanel  index={3} value={currentTab}
        onChange={handleTabChange}
        centered
        variant="fullWidth" // Add this variant to create a gap between tabs
        sx={{ marginBottom: 4 }}>
      <Grid container spacing={3}>
      {events.map((event) => (
  <Grid item xs={12} sm={6} lg={4} key={event.id}>
    <Paper className="p-4">
      <Typography variant="h6">{event.title}</Typography>
      <Typography>Date: {event.date}</Typography>
      <Typography>Time: {event.time}</Typography>
      <Typography>Venue: {event.location}</Typography>
      <Typography>Description: {event.description}</Typography>
      <Typography>Registration Link: {event.registrationLink}</Typography>
      <IconButton
        color="secondary"
        onClick={() => handleDeleteEvent(event.id)}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  </Grid>
))}

      </Grid>

      
</TabPanel>

<TabPanel label="Student List" value={currentTab} index={1} sx={{ marginBottom: 4 }}>
<div className="mb-4">
        <Typography variant="h5" className="mb-2">
          Search Students
        </Typography>
        <TextField
          label="Search by Name, Department, or Year"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
  {showStudentList && (
    <div>
     <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExport}
                    >
                      Export Data
                    </Button>
   
      <Typography variant="h5" className="mb-2">
        List of Students:
      </Typography>
      <div className="table-container">
            <Table>
            <TableHead>
              <TableRow>
              <TableCell sx={{ color: 'black' }}>Username</TableCell>
        <TableCell sx={{ color: 'black' }}>Name</TableCell>
        <TableCell sx={{ color: 'black' }}>Year</TableCell>
        <TableCell sx={{ color: 'black' }}>Branch</TableCell>
        <TableCell sx={{ color: 'black' }}>E-Mail ID</TableCell>
        <TableCell sx={{ color: 'black' }}>Gmail ID</TableCell>
        <TableCell sx={{ color: 'black' }}>Phone Number</TableCell>
        <TableCell sx={{ color: 'black' }}>Blood Group</TableCell>
        <TableCell sx={{ color: 'black' }}>Father Name</TableCell>
        <TableCell sx={{ color: 'black' }}>Father Phone Number</TableCell>
        <TableCell sx={{ color: 'black' }}>Mother Name</TableCell>
        <TableCell sx={{ color: 'black' }}>Mother Phone Number</TableCell>
        <TableCell sx={{ color: 'black' }}>Guardian Name</TableCell>
        <TableCell sx={{ color: 'black' }}>Guardian Phone Number</TableCell>
        <TableCell sx={{ color: 'black' }}>Hostel</TableCell>
        <TableCell sx={{ color: 'black' }}>Residential Address</TableCell>
        <TableCell sx={{ color: 'black' }}>KTUid</TableCell>
        <TableCell sx={{ color: 'black' }}>Area of Interest</TableCell>
        <TableCell sx={{ color: 'black' }}>Year of Joining</TableCell>
        <TableCell sx={{ color: 'black' }}>Year of Joining IEDC</TableCell>
        <TableCell sx={{ color: 'black' }}>Skills</TableCell>
        <TableCell sx={{ color: 'black' }}>Online Payment</TableCell>
        <TableCell sx={{ color: 'black' }}>IEDC Posts</TableCell>
        <TableCell sx={{ color: 'black' }}>Assigned Post</TableCell>
           
            
          </TableRow>
        </TableHead>
        <TableBody>
       
      {searchResults.map((student, index) => (
        <TableRow key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <TableCell>{student.username}</TableCell>
              <TableCell>{`${student.firstname} ${student.lastname}`}</TableCell>
              <TableCell>{student.year}</TableCell>
              <TableCell>{student.Branch}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.gmail}</TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.bloodgroup}</TableCell>
              <TableCell>{student.fathername}</TableCell>
              <TableCell>{student.fatherphnumber}</TableCell>
              <TableCell>{student.mothername}</TableCell>
              <TableCell>{student.motherphnumber}</TableCell>
              <TableCell>{student.guardianname}</TableCell>
              <TableCell>{student.guardianphnumber}</TableCell>
              <TableCell>{student.hostel}</TableCell>
              <TableCell>{student.ResidentialAddress}</TableCell>
              <TableCell>{student.KTUid}</TableCell>
              <TableCell>{student.Areaofinterset}</TableCell>
              <TableCell>{student.yearofjoining}</TableCell>
              <TableCell>{student.iedcjoiningdate}</TableCell>
              <TableCell>{student.skills}</TableCell>
              <TableCell>{student.cashOnHand ? 'No' : 'Yes'}</TableCell>
              <TableCell>{student.posts}</TableCell>
             
              <TableCell>
                <FormControl>
                  <InputLabel>Assign Post</InputLabel>
                  <Select
                    value={assignedPosts[student.uid] || ''}
                    onChange={(e) =>
                      handlePostAssignment(student.uid, e.target.value)
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="NotMember">Not Verify</MenuItem>
                    <MenuItem value="Member">Member</MenuItem>
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="CTO">CTO</MenuItem>
                    <MenuItem value="CWO">CWO</MenuItem>
                    <MenuItem value="CMO">CMO</MenuItem>
                    <MenuItem value="CFO">CFO</MenuItem>
                    <MenuItem value="CPO">CPO</MenuItem>
                    <MenuItem value="CCO">CCO</MenuItem>
                    <MenuItem value="COO">COO</MenuItem>
                    <MenuItem value="CIO">CIO</MenuItem>
                    <MenuItem value="WOW">WOW</MenuItem>
                    <MenuItem value="WTM">WTM</MenuItem>
                    <MenuItem value="DEPT CO-ODRTINATOR">DEPT-COODRINATOR</MenuItem>
                    <MenuItem value="IPR AND RESEARCH OFFICER">IPR AND RESEARCH OFFICER</MenuItem>
                  </Select>
                </FormControl>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
     
  
    
      <Button
        variant="contained"
        color="primary"
        className="small-button"
        onClick={handleSavePosts}
      >
        Save Assigned Posts
      </Button>
      </div>
</div>
  )}
     </TabPanel>
    

{/* Logout button */}
<Button variant="contained" size="small" color="warning" onClick={handleLogout}>
        Logout
      </Button>


 {/* Snackbar for Notifications */}
 <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: 'green',
            color: 'white',
          }}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>

      {/* Confirm Delete Event Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteEvent(deleteEventId)}
          >
            Yes, Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmDialogOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StaffDashboard;
