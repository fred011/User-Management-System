/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { examinationSchema } from "../../../../Components/yupSchema/examinationSchema";
import { baseAPI } from "../../../../environment";
import axios from "axios";
import { useEffect } from "react";

export default function ExaminationsStudent() {
  const [examinations, setExaminations] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");

  const [editId, setEditId] = React.useState(null);

  const [loading, setLoading] = React.useState(false); // Loader state
  const [token, setToken] = React.useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage

  const [className, setClassName] = React.useState("");
  const fetchStudentDetails = async () => {
    if (!token) {
      console.error("No token available, cannot fetch student details");
      return;
    }
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${baseAPI}/student/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
        withCredentials: true,
      });
      if (response.data.student && response.data.student._id) {
        setSelectedClass(response.data.student.student_class._id);
        setClassName(response.data.student.student_class.class_text);
      } else {
        console.error("Student ID not found in response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching student details:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (token) {
      console.log("Token is available, fetching student details...");
      fetchStudentDetails();
    }
  }, [token]);

  const fetchExaminations = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true); // Start loading
      if (selectedClass) {
        const response = await axios.get(
          `${baseAPI}/examination/class/${selectedClass}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("FETCHED EXAM:", response);
        setExaminations(response.data.examinations);
      }
    } catch (error) {
      console.log("Error fetching Exam Data", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {/* Class Selection Section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "#1976d2",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Examinations for your Class: [{className}]
      </Typography>

      {/* Loader */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Exam Table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="exam table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Exam Date
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Subject
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Exam Type
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examinations.length > 0 ? (
                  examinations.map((examination) => (
                    <TableRow key={examination._id}>
                      <TableCell>{convertDate(examination.examDate)}</TableCell>
                      <TableCell>
                        {examination.subject
                          ? examination.subject.subject_name
                          : ""}
                      </TableCell>
                      <TableCell>{examination.examType}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Examinations Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
