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

export default function Examinations() {
  const [examinations, setExaminations] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [loading, setLoading] = React.useState(false); // Add a loading state

  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // Get the full month name
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (value) => {
      const token = localStorage.getItem("token");

      if (editId) {
        try {
          console.log("Examination", value);
          const response = await axios.patch(
            `${baseAPI}/examination/update/${editId}`,
            {
              date: value.date,
              subjectId: value.subject,
              classId: selectedClass,
              examType: value.examType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("Exam Updated Successfully");
          formik.resetForm();
          setEditId(null);
          fetchExaminations();
          console.log("RESPONSE Updated EXAM", response);
        } catch (error) {
          console.log("Error updating Exam", error);
          alert("Failed to update Exam");
        }
      } else {
        try {
          console.log("Examination", value);
          const response = await axios.post(
            `${baseAPI}/examination/create`,
            {
              date: value.date,
              subjectId: value.subject,
              classId: selectedClass,
              examType: value.examType,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("New Exam Saved Successfully");
          formik.resetForm();
          fetchExaminations();
          console.log("RESPONSE NEW EXAM", response);
        } catch (error) {
          console.log("Error saving new Exam", error);
          alert("Failed to save Exam");
        }
      }
    },
  });

  const handleEdit = (id) => {
    console.log("Edit", id);

    setEditId(id);
    const selectedExam = examinations.filter((x) => x._id === id);
    formik.setFieldValue("date", selectedExam[0].examDate);
    formik.setFieldValue("subject", selectedExam[0].subject._id);
    formik.setFieldValue("examType", selectedExam[0].examType);
  };

  const handleEditCancel = () => {
    setEditId(null);
    formik.resetForm();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete exam?")) {
      const token = localStorage.getItem("token");
      console.log("Delete", id);

      axios
        .delete(`${baseAPI}/examination/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Exam delete response", res);

          alert("Exam deleted successfully");
          fetchExaminations();
        })
        .catch((err) => {
          console.log("Error in deleting Exam", err);

          alert("Failed to delete Exam");
        });
    }
  };

  const fetchExaminations = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // Set loading to true before fetching

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
      setLoading(false); // Set loading to false after fetching
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
      <Paper
        sx={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel>Select Class</InputLabel>
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

      {/* Exam Form Section */}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <Box
          component="form"
          sx={{
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "10px",
              fontWeight: "600",
              textAlign: "center",
              color: "#1976d2",
            }}
          >
            {editId ? "Edit Exam" : "Add New Exam"}
          </Typography>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Exam Date"
              value={formik.values.date ? dayjs(formik.values.date) : null}
              name="date"
              onChange={(newValue) => {
                formik.setFieldValue("date", newValue);
              }}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </LocalizationProvider>
          {formik.touched.date && formik.errors.date && (
            <Typography color="error" sx={{ fontSize: "12px" }}>
              {formik.errors.date}
            </Typography>
          )}

          {/* Subject Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={formik.values.subject}
              name="subject"
              label="Subject"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value={""}>Select Subject</MenuItem>
              {subjects?.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.subject_name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.subject && formik.errors.subject && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {formik.errors.subject}
              </Typography>
            )}
          </FormControl>

          {/* Exam Type Field */}
          <TextField
            name="examType"
            value={formik.values.examType}
            label="Exam Type"
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
          />
          {formik.touched.examType && formik.errors.examType && (
            <Typography color="error" sx={{ fontSize: "12px" }}>
              {formik.errors.examType}
            </Typography>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: editId ? "space-between" : "flex-start",
              gap: "15px",
            }}
          >
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} />
              ) : editId ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>

            {editId && (
              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={handleEditCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

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
              <TableCell
                align="center"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : examinations.length > 0 ? (
              examinations.map((examination) => (
                <TableRow key={examination._id}>
                  <TableCell>{convertDate(examination.examDate)}</TableCell>
                  <TableCell>
                    {examination.subject
                      ? examination.subject.subject_name
                      : ""}
                  </TableCell>
                  <TableCell>{examination.examType}</TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleEdit(examination._id)}
                      sx={{ marginRight: "10px" }}
                    >
                      <EditIcon color="primary" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(examination._id)}
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
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
  );
}
