import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import { baseAPI } from "../../../environment";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "", role: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${baseAPI}/auth/request-reset-password`, formData);
      alert("Password reset email sent. Check your inbox!");
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        p: 4,
        backgroundColor: "white",
        boxShadow: 4,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight={600}
        color="primary"
      >
        Forgot Password
      </Typography>

      <TextField
        label="Email Address"
        name="email"
        type="email"
        fullWidth
        variant="outlined"
        margin="normal"
        onChange={handleChange}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel sx={{ fontWeight: 500 }}>Select Role</FormLabel>
        <RadioGroup row name="role" onChange={handleChange}>
          <FormControlLabel
            value="admin"
            control={<Radio color="primary" />}
            label="Admin"
          />
          <FormControlLabel
            value="teacher"
            control={<Radio color="primary" />}
            label="Teacher"
          />
          <FormControlLabel
            value="student"
            control={<Radio color="primary" />}
            label="Student"
          />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          borderRadius: 2,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#1976d2",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </Box>
  );
}
