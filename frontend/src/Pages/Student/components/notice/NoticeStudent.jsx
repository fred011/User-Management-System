/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "../../../../environment";

const NoticeStudent = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

  const fetchAllNotices = () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
    setLoading(true); // Start loading

    axios
      .get(`${baseAPI}/notice/student-notice`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      })
      .then((res) => {
        console.log("Student Notices", res.data);
        setNotices(res.data.data);
      })
      .catch((err) => {
        console.log("Error in fetching all Student notices", err);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "700",
          color: "primary.main",
          mb: 5,
        }}
      >
        Notices
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
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {notices.map((notice) => (
            <Paper
              key={notice._id}
              sx={{
                width: 300,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 3,
                },
              }}
              elevation={2}
            >
              <Box>
                <Typography variant="h5" color="primary" gutterBottom>
                  {notice.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {notice.message}
                </Typography>
                <Typography variant="subtitle2" color="text.disabled">
                  Audience: {notice.audience.toUpperCase()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </>
  );
};

export default NoticeStudent;
