/* eslint-disable no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { registerSchema } from "../../../Components/yupSchema/registerSchema"; // Import the validation schema
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // To navigate between pages after registration
import { baseAPI } from "../../../environment";

export default function Register() {
  const navigate = useNavigate(); // Initialize the navigation function

  // Define initial form field values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    //role: "", // Will store the selected role
  };

  // Formik setup for form state management, validation, and submission
  const formik = useFormik({
    initialValues, // Set initial values
    validationSchema: registerSchema, // Attach Yup schema for validation
    onSubmit: (values, { resetForm }) => {
      // Prepare the data to be sent to the API
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        //role: values.role,
      };

      // API call to register the user
      axios
        .post(
          `${baseAPI}/admin/register`, // API endpoint depends on the selected role
          data,
          { withCredentials: true } // Include credentials like cookies
        )
        .then((res) => {
          // On successful registration
          alert(`Admin registered successfully!`);

          resetForm(); // Clear the form
          navigate(`/admin`); // Navigate to the respective role dashboard
        })
        .catch((err) => {
          // Handle errors
          alert(err.response?.data?.error || "Error registering user");
        });
    },
  });

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 }, // Add margin to child elements
          display: "flex",
          flexDirection: "column",
          width: "60vw",
          minWidth: "230px",
          margin: "auto",
          marginTop: "50px",
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit} // Attach Formik's submit handler
      >
        <h1>Admin Registration Form</h1>
        {/* Name Input */}
        <TextField
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p style={{ color: "red" }}>{formik.errors.name}</p> // Show error if name is invalid
        )}

        {/* Email Input */}
        <TextField
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        )}

        {/* Password Input */}
        <TextField
          type="password"
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <p style={{ color: "red" }}>{formik.errors.password}</p>
        )}

        {/* Confirm Password Input */}
        <TextField
          type="password"
          name="confirm_password"
          label="Confirm Password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <p style={{ color: "red" }}>{formik.errors.confirm_password}</p>
        )}

        {/* Role Selection */}
        {/* <FormControl component="fieldset">
          <FormLabel component="legend">Register As:</FormLabel>
          <RadioGroup
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            <FormControlLabel
              value="teacher"
              control={<Radio />}
              label="Teacher"
            />
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="Student"
            />
          </RadioGroup>
        </FormControl> */}
        {/* {formik.touched.role && formik.errors.role && (
          <p style={{ color: "red" }}>{formik.errors.role}</p>
        )} */}

        {/* Submit Button */}
        <Button type="submit" variant="contained">
          Register
        </Button>
        <p>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
            Login
          </Link>
        </p>
      </Box>
    </>
  );
}
