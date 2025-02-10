import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseAPI } from "../../../../environment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const AttendanceTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [attendanceChecked, setAttendanceChecked] = useState(false);

  const fetchAttendeeClass = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseAPI}/class/attendee`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching classes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendeeClass();
  }, []);

  const checkAttendanceAndFetchStudents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (selectedClass) {
        const [studentResponse, attendanceResponse] = await Promise.all([
          axios.get(`${baseAPI}/student/fetch-with-query`, {
            params: { student_class: selectedClass },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseAPI}/attendance/check/${selectedClass}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!attendanceResponse.data.attendanceTaken) {
          setStudents(studentResponse.data.students);
          studentResponse.data.students.forEach((student) => {
            setAttendanceStatus((prevStatus) => ({
              ...prevStatus,
              [student._id]: "present",
            }));
          });
        } else {
          setAttendanceChecked(true);
        }
      }
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      checkAttendanceAndFetchStudents();
    }
  }, [selectedClass]);

  const submitAttendance = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, authentication required.");
      return;
    }

    try {
      await Promise.all(
        students.map((student) =>
          axios.post(
            `${baseAPI}/attendance/mark`,
            {
              studentId: student._id,
              date: new Date(),
              classId: selectedClass,
              status: attendanceStatus[student._id],
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      alert("Attendance marked successfully!");
      setAttendanceChecked(true); // Mark attendance as taken
      setStudents([]); // Clear students since attendance is already taken
    } catch (error) {
      console.error("Error in submitAttendance", error);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "#1976d2",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Attendance
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ marginTop: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {classes.length > 0 ? (
            <Paper
              sx={{
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                You are an attendee of {classes.length} classes.
              </Alert>
              <FormControl sx={{ minWidth: "250px" }}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass || ""}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setAttendanceChecked(false);
                  }}
                >
                  <MenuItem value="">Select Class</MenuItem>
                  {classes.map((x) => (
                    <MenuItem key={x._id} value={x._id}>
                      {x.class_text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          ) : (
            <Alert severity="error">
              You are not an attendee of any class.
            </Alert>
          )}

          {attendanceChecked ? (
            <Alert severity="info">
              Attendance has already been taken for this class today.
            </Alert>
          ) : (
            <>
              {students.length > 0 && (
                <>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976d2" }}>
                          <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                            Student Name
                          </TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>
                              <FormControl sx={{ minWidth: "150px" }}>
                                <InputLabel>Attendance</InputLabel>
                                <Select
                                  value={
                                    attendanceStatus[student._id] || "present"
                                  }
                                  label="Attendance"
                                  onChange={(e) =>
                                    setAttendanceStatus((prevStatus) => ({
                                      ...prevStatus,
                                      [student._id]: e.target.value,
                                    }))
                                  }
                                >
                                  <MenuItem value="present">Present</MenuItem>
                                  <MenuItem value="absent">Absent</MenuItem>
                                </Select>
                              </FormControl>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" onClick={submitAttendance}>
                      Take Attendance
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default AttendanceTeacher;
