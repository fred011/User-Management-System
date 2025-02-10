/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import * as React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid2,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { Link } from "react-router-dom";
import Attendee from "./Attendee";
import { useState } from "react";
import { baseAPI } from "../../../../environment";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

export default function AttendanceStudentList() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [params, setParams] = useState({});

  // Fetch attendance for all students
  const fetchAttendanceForStudents = async (studentsList) => {
    const attendancePromises = studentsList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    });
    setAttendanceData(updatedAttendanceData);
    console.log(updatedAttendanceData);
  };

  // Fetch attendance for a specific student
  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseAPI}/attendance/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response Data for Attendance:", response.data); // Log the full response data

      const attendanceRecords = response.data; // Check how the data is structured

      // Check if attendanceRecords is an array and contains the necessary information
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;

      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      console.log(
        `Attendance for student ${studentId}: ${attendancePercentage}%`
      );

      return { studentId, attendancePercentage };
    } catch (error) {
      console.error(
        `Error fetching attendance for student ${studentId}`,
        error
      );
      return { studentId, attendancePercentage: 0 };
    }
  };

  // Fetch all available classes
  const fetchClasses = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${baseAPI}/class/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setClasses(res.data.data);
      })
      .catch((e) => {
        console.error("Error in fetching classes", e.response || e.message);
      });
  };

  // Fetch students based on parameters (including selected class)
  const fetchStudents = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${baseAPI}/student/fetch-with-query`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data.students);
        fetchAttendanceForStudents(res.data.students);
      })
      .catch((e) => {
        console.error("Error in fetching students", e.response || e.message);
      });
  };

  // Handle class selection
  const handleClass = (e) => {
    const selectedClassId = e.target.value;
    setParams((prevParams) => ({
      ...prevParams,
      student_class: selectedClassId || undefined,
    }));
  };

  // Handle search input change
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  React.useEffect(() => {
    fetchStudents();
  }, [params]);

  return (
    <>
      <Box
        sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "500",
            marginBottom: 4,
            color: "#1976d2",
            textTransform: "uppercase",
          }}
        >
          Students Attendance
        </Typography>

        <Grid2 container spacing={3}>
          {/* Filters Section */}
          <Grid2 item xs={12} md={4}>
            <Item
              sx={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                Filter Students
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Search by Name"
                  value={params.search || ""}
                  onChange={handleSearch}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel id="student_class" sx={{ color: "#1976d2" }}>
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="student_class"
                    label="Select Class"
                    value={params.student_class || ""}
                    onChange={handleClass}
                    sx={{
                      backgroundColor: "#ffffff",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">All Classes</MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls._id} value={cls._id}>
                        {cls.class_text} ({cls.class_num})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {params.student_class && (
                  <Attendee classId={params.student_class} />
                )}
              </Box>
            </Item>
          </Grid2>

          {/* Students Table Section */}
          <Grid2 item xs={12} md={8}>
            <Item
              sx={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
                Students List
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Gender
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Guardian Phone
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Class
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Attendance %
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow
                          key={student._id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f9f9f9",
                            },
                          }}
                        >
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.gender}</TableCell>
                          <TableCell>{student.guardian_phone}</TableCell>
                          <TableCell>
                            {student.student_class
                              ? student.student_class.class_text
                              : "Not Assigned"}
                          </TableCell>
                          <TableCell>
                            {attendanceData[student._id] !== undefined
                              ? `${attendanceData[student._id].toFixed(2)}%`
                              : "No Data"}
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/admin/attendance/${student._id}`}
                              style={{
                                textDecoration: "none",
                                color: "#1976d2",
                                fontWeight: "bold",
                              }}
                            >
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No students found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Item>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
}
