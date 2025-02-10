/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseAPI } from "../../../../environment";

export default function Attendee({ classId }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(false); // Loading for fetching data
  const [submitting, setSubmitting] = useState(false); // Loading for submission

  // Fetch class details to get the current attendee
  const fetchClassDetails = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseAPI}/class/single/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAttendee(response.data.data.attendee || null);
    } catch (error) {
      console.error(
        "Error fetching class details",
        error.response || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseAPI}/teacher/fetch-with-query`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle attendee update
  const handleSubmit = async () => {
    if (!selectedTeacher) {
      alert("Please select an attendee teacher first.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${baseAPI}/class/update/${classId}`,
        { attendee: selectedTeacher },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Attendee saved/updated successfully");
      fetchClassDetails(); // Refresh attendee after submission
    } catch (error) {
      console.error("ERROR:", error.response || error.message);
      alert("Failed to update attendee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
    fetchTeachers();
  }, [classId]);

  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: "100%",
        maxWidth: 500,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "500", textAlign: "center" }}
      >
        Attendee Management
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Display Current Attendee */}
          {attendee && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                p: 2,
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: 1,
              }}
            >
              <Typography variant="h6">Current Attendee:</Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "600", color: "primary.main" }}
              >
                {attendee.name}
              </Typography>
            </Box>
          )}

          {/* Select Teacher Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Teacher</InputLabel>
            <Select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <MenuItem value="">
                <em>Select Teacher</em>
              </MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "600",
              backgroundColor: submitting ? "gray" : "primary.main",
              "&:hover": {
                backgroundColor: submitting ? "gray" : "primary.dark",
              },
            }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : attendee
              ? "Change Attendee"
              : "Select Attendee"}
          </Button>
        </>
      )}
    </Box>
  );
}
