/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseAPI } from "../../../../environment";

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage
  const [loading, setLoading] = useState(true); // Loader state
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchAdminDetails = async () => {
    if (!token) {
      console.log("No token available, cannot fetch admin details");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseAPI}/admin/fetch-single`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setAdminDetails(response.data.admin);
    } catch (error) {
      console.error(
        "Error fetching admin details:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${baseAPI}/student/fetch-with-query`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students);
    } catch (e) {
      console.error("Error in fetching students", e.response || e.message);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseAPI}/class/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data.data);
    } catch (e) {
      console.error("Error in fetching classes", e);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${baseAPI}/teacher/fetch-with-query`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data.teachers);
    } catch (e) {
      console.error("Error in fetching teachers:", e.response || e.message);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseAPI}/subject/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(response.data.data);
    } catch (e) {
      console.error("Error in fetching subjects", e.response || e.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminDetails();
      fetchStudents();
      fetchClasses();
      fetchTeachers();
      fetchSubjects();

      // **Auto-refresh data every 30 seconds**
      const interval = setInterval(() => {
        fetchStudents();
        fetchClasses();
        fetchTeachers();
        fetchSubjects();
      }, 30000); // Fetch data every 30 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [token]);

  const cardData = [
    {
      title: "Total Students",
      count: students.length,
      color: "#3f51b5",
      path: "/admin/students",
    },
    {
      title: "Total Teachers",
      count: teachers.length,
      color: "#ff9800",
      path: "/admin/teachers",
    },
    {
      title: "Total Classes",
      count: classes.length,
      color: "#4caf50",
      path: "/admin/class",
    },
    {
      title: "Total Subjects",
      count: subjects.length,
      color: "#e91e63",
      path: "/admin/subjects",
    },
  ];

  return (
    <>
      <Box
        sx={{
          height: "270px",
          width: "100%",
          background: `url(../../BackG copy.jpg) center/cover no-repeat`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "270px",
            width: "100%",
            background: `url(../../BackG copy.jpg) center/cover no-repeat`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        />
        {loading ? (
          <CircularProgress sx={{ color: "white", zIndex: 2 }} />
        ) : (
          <Box sx={{ textAlign: "center", zIndex: 2 }}>
            <Typography variant="h3" color="white">
              Welcome, {adminDetails ? adminDetails.name : "Admin"}
            </Typography>
            <Typography variant="h5" color="lightgrey">
              To The Learner`s Student Management System
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Grid2
          container
          spacing={4}
          justifyContent="center"
          sx={{ maxWidth: "90%" }}
        >
          {cardData.map((card, index) => (
            <Grid2 xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                onClick={() => navigate(card.path)}
                sx={{
                  backgroundColor: card.color,
                  color: "white",
                  textAlign: "center",
                  height: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: 6,
                  borderRadius: 4,
                  transition: "transform 0.2s, box-shadow 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 10,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">
                    {card.title}
                  </Typography>
                  <Typography variant="h2" fontWeight="bold">
                    {card.count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </>
  );
};

export default Dashboard;
