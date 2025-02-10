import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { loginSchema } from "../../../Components/yupSchema/loginSchema";
import {
  Box,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { baseAPI } from "../../../environment";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "", role: "" },
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      const data = { email: values.email, password: values.password };

      axios
        .post(`${baseAPI}/${values.role}/login`, data, {
          withCredentials: true,
        })
        .then((res) => {
          const token = res.data.token;
          const user = { ...res.data, role: values.role };

          // Store in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("auth", JSON.stringify(user));

          login(user); // Update context state

          // Verify token
          return axios.post(
            `${baseAPI}/auth/verify-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
        .then((verificationResponse) => {
          console.log("Token verified successfully", verificationResponse.data);
          alert("Logged in successfully");

          resetForm();
          navigate(`/${formik.values.role}`);
        })
        .catch((err) => {
          console.log("Failed to login", err);
          alert(err.response?.data?.error || "Login error");
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <Box
      sx={{
        backgroundColor: "#dedede", // Light gray background
        minHeight: "100vh", // Full page height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "40vw",
          minWidth: "250px",
          backgroundColor: "white", // Keep form background white for contrast
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            color: "primary.main",
            mb: 5,
          }}
        >
          Login
        </Typography>

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

        <FormControl component="fieldset">
          <FormLabel component="legend">Log In As:</FormLabel>
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
        </FormControl>
        {formik.touched.role && formik.errors.role && (
          <p style={{ color: "red" }}>{formik.errors.role}</p>
        )}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Log In"}
        </Button>
        <Typography variant="h7">
          Forgot Password?{" "}
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "blue" }}
          >
            Reset Here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
