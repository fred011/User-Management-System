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

export default function ExaminationsTeacher() {
  const [examinations, setExaminations] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [loading, setLoading] = React.useState(false); // State to manage loading
  const [editId, setEditId] = React.useState(null);

  const convertDate = (dateData) => {
    const date = new Date(dateData);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // Get the full month name
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchExaminations = async () => {
    setLoading(true); // Set loading to true before fetching data
    const token = localStorage.getItem("token");

    try {
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
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const fetchSubjects = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseAPI}/subject/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("EXAM SUBJECTS:", response);
      setSubjects(response.data.data);
    } catch (error) {
      console.log("Error fetching Subjects (Exam Comp)", error);
    }
  };

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseAPI}/class/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("EXAM Classes:", response);
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id);
    } catch (error) {
      console.log("Error fetching classes (Exam Comp)", error);
    }
  };

  useEffect(() => {
    fetchExaminations();
  }, [selectedClass]);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  return (
    <>
      {/* Class Selection Section */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "500",
          color: "#1976d2",
          marginBottom: 2,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Examinations
      </Typography>
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
            >
              <MenuItem value={""}>Select Class</MenuItem>
              {classes?.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Loading Spinner */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </>
  );
}
