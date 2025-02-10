/* eslint-disable no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Formik, useFormik } from "formik";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Button,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";

import {
  teacherEditSchema,
  teacherSchema,
} from "../../../../Components/yupSchema/teacherSchema";
import { useState } from "react";
import { baseAPI } from "../../../../environment";

export default function Teachers() {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const [classes, setClasses] = useState([]);
  // Define initial form field values
  const initialValues = {
    name: "",
    email: "",
    qualification: "",
    age: "",
    gender: "",

    phone_number: "",
    password: "",
    confirm_password: "",
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      console.log("Delete", id);
      axios
        .delete(`${baseAPI}/teacher/delete/${id}`)
        .then((res) => {
          console.log("Teacher delete response", res);
          alert("Teacher deleted successfully");
          fetchTeachers(); // Fetch updated list after delete
        })
        .catch((err) => {
          console.log("Error in deleting teacher", err);
          alert(err.response?.data?.error || "Failed to delete teacher");
        });
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm(); // Reset form values
  };

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);

    const filteredTeacher = teachers.find((x) => x._id === id);
    console.log("Filtered Teacher", filteredTeacher);

    if (filteredTeacher) {
      formik.setFieldValue("name", filteredTeacher.name);
      formik.setFieldValue("email", filteredTeacher.email);
      formik.setFieldValue("qualification", filteredTeacher.qualification);
      formik.setFieldValue("age", filteredTeacher.age);
      formik.setFieldValue("gender", filteredTeacher.gender);
      formik.setFieldValue("guardian", filteredTeacher.guardian);
      formik.setFieldValue("phone_number", filteredTeacher.phone_number);
    }
  };

  // Formik setup for form state management, validation, and submission
  const formik = useFormik({
    initialValues, // Set initial values
    validationSchema: edit ? teacherEditSchema : teacherSchema, // Attach Yup schema for validation
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      const data = {
        name: values.name,
        email: values.email,
        qualification: values.qualification,
        age: values.age,
        gender: values.gender,
        phone_number: values.phone_number,
      };

      if (values.password) {
        data.password = values.password; // Include password only if provided
      }

      const apiCall = edit
        ? axios.patch(`${baseAPI}/teacher/update/${editId}`, data, {
            withCredentials: true,
          })
        : axios.post(`${baseAPI}/teacher/register`, data, {
            withCredentials: true,
          });

      apiCall
        .then((res) => {
          console.log(
            `${edit ? "Updated" : "Registered"} Teachers data:`,
            res.data.data
          );
          alert(
            `${edit ? "Teacher updated" : "Teacher registered"} successfully!`
          );
          resetForm();
          fetchTeachers(); // Fetch updated list after submit
        })
        .catch((err) => {
          console.log("Error in submitting teacher", err);
          alert(
            err.response?.data?.error ||
              `Error ${edit ? "updating" : "registering"} teacher`
          );
        })
        .finally(() => setLoading(false));
    },
  });

  // Teacher search functionality
  const [params, setParams] = useState({});
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined, // If no input, remove 'search' param
    }));
  };

  const [teachers, setTeachers] = useState([]);
  const fetchTeachers = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }

    console.log("Token retrieved: ", token); // Debugging token

    axios
      .get(`${baseAPI}/teacher/fetch-with-query`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included in the header
        },
      })
      .then((res) => {
        setTeachers(res.data.teachers);
        console.log("Response Teachers:", res);
      })
      .catch((e) => {
        // Enhanced error handling
        const errorMessage = e.response ? e.response.data.message : e.message;
        console.log("Error in fetching teachers:", errorMessage);
      })
      .finally(setLoading(false));
  };

  React.useEffect(() => {
    fetchTeachers();
  }, [params]);

  return (
    <>
      <Box
        component={"div"}
        sx={{
          height: "100%",
          paddingTop: "20px", // Increased padding for a cleaner look
          paddingBottom: "20px",
          backgroundColor: "#f4f6f9", // Light background color for the section
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "500",
            marginBottom: "20px", // Add spacing below the title
            color: "#333", // Darker color for the heading
          }}
        >
          Teachers
        </Typography>

        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 2 }, // Add margin to child elements for spacing
            display: "flex",
            flexDirection: "column",
            width: "60vw",
            minWidth: "230px",
            margin: "auto",
            backgroundColor: "#fff", // White background for the form
            borderRadius: "8px", // Rounded corners for the form
            padding: "20px", // Padding inside the form
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow for form elevation
          }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          {edit ? (
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "500",
                marginBottom: "15px", // Add spacing below the title
                color: "#1976d2", // Highlight edit text with blue
              }}
            >
              Edit Teacher
            </Typography>
          ) : (
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: "500",
                marginBottom: "15px", // Add spacing below the title
                color: "#1976d2", // Highlight add text with blue
              }}
            >
              Add Teacher
            </Typography>
          )}

          {/* Name Input */}
          <TextField
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }} // Add margin for spacing between fields
          />
          {formik.touched.name && formik.errors.name && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.name}
            </Typography>
          )}

          {/* Email Input */}
          <TextField
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.email && formik.errors.email && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.email}
            </Typography>
          )}

          {/* Qualification Input */}
          <TextField
            name="qualification"
            label="Qualification"
            value={formik.values.qualification}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.qualification && formik.errors.qualification && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.qualification}
            </Typography>
          )}

          {/* Age Input */}
          <TextField
            name="age"
            label="Age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.age && formik.errors.age && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.age}
            </Typography>
          )}

          {/* Gender Input */}
          <FormControl fullWidth sx={{ marginBottom: "15px" }}>
            <InputLabel id="gender">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              value={formik.values.gender}
              label="Gender"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
          {formik.touched.gender && formik.errors.gender && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.gender}
            </Typography>
          )}

          {/* Phone Input */}
          <TextField
            name="phone_number"
            label="Phone Number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.phone_number && formik.errors.phone_number && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.phone_number}
            </Typography>
          )}

          {/* Password Input */}
          <TextField
            type="password"
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.password && formik.errors.password && (
            <Typography
              color="error"
              variant="body2"
              sx={{ marginBottom: "15px" }}
            >
              {formik.errors.password}
            </Typography>
          )}

          {/* Confirm Password Input */}
          <TextField
            type="password"
            name="confirm_password"
            label="Confirm Password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{ marginBottom: "15px" }}
          />
          {formik.touched.confirm_password &&
            formik.errors.confirm_password && (
              <Typography
                color="error"
                variant="body2"
                sx={{ marginBottom: "15px" }}
              >
                {formik.errors.confirm_password}
              </Typography>
            )}

          {/* Submit Button */}
          <Button
            sx={{ width: "120px", marginBottom: "15px" }}
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>

          {edit && (
            <Button
              sx={{ width: "120px", marginBottom: "15px" }}
              onClick={() => cancelEdit()}
              type="button"
              variant="outlined"
            >
              Cancel
            </Button>
          )}
        </Box>

        <Box
          component={"div"}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <TextField
            label="Search"
            value={params.search ? params.search : ""}
            onChange={(e) => {
              handleSearch(e);
            }}
            sx={{ width: "300px" }} // Set a width for the search input
          />
        </Box>

        {/* Table for Teachers */}
        <TableContainer component={Paper} sx={{ marginTop: "40px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="teacher table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Qualification</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Age</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Gender</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell
                  sx={{ color: "#fff", fontWeight: "bold" }}
                  align="center"
                >
                  <strong>Actions</strong>
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
              ) : (
                teachers &&
                teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.age}</TableCell>
                    <TableCell>{teacher.gender}</TableCell>
                    <TableCell>{teacher.phone_number}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          handleEdit(teacher._id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          handleDelete(teacher._id);
                        }}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
