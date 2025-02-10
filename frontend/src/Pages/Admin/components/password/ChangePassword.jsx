import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { baseAPI } from "../../../../environment";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${baseAPI}/auth/change-password`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Password updated successfully!");
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
        p: 3,
        backgroundColor: "white",
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" textAlign="center">
        Change Password
      </Typography>
      <TextField
        type="password"
        label="Current Password"
        name="currentPassword"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        type="password"
        label="New Password"
        name="newPassword"
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Change Password"}
      </Button>
    </Box>
  );
}
