/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { baseAPI } from "../../../../environment";

const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [token, setToken] = React.useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage

  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: History, Teacher: Harry",
      start: new Date(date.setHours(9, 30)),
      end: new Date(date.setHours(11, 30)),
    },
  ];

  const fetchStudentDetails = async () => {
    if (!token) {
      console.error("No token available, cannot fetch student details");
      return;
    }
    try {
      const response = await axios.get(`${baseAPI}/student/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
        withCredentials: true,
      });

      setSelectedClass(response.data.student.student_class);
    } catch (error) {
      console.error(
        "Error fetching student details:",
        error.response?.data || error.message
      );
    }
  };

  React.useEffect(() => {
    if (token) {
      console.log("Token is available, fetching student details...");
      fetchStudentDetails();
    }
  }, [token]);

  const fetchSchedule = (selectedClass) => {
    if (selectedClass) {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
      console.log("Fetching schedules for class:", selectedClass);

      axios
        .get(`${baseAPI}/schedule/fetch-with-class/${selectedClass._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        })
        .then((res) => {
          console.log("API Response:", res.data);

          if (res.data.data.length === 0) {
            console.log("No schedules found:");
            setEvents([]); // Clear events if no schedules
          } else {
            const resData = res.data.data.map((x) => {
              return {
                id: x._id,
                title: `Subject: ${x.subject.subject_name} , Teacher:${x.teacher.name}`,
                start: new Date(x.startTime),
                end: new Date(x.endTime),
              };
            });
            setEvents(resData); // Update with retrieved schedules
          }
        })
        .catch((err) => {
          console.log("Error in fetching schedule:", err.response?.data || err);
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  };

  useEffect(() => {
    fetchSchedule(selectedClass);
  }, [selectedClass]);

  return (
    <>
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
        Schedule for Your Class: [
        {selectedClass ? selectedClass.class_text : "no class"}]
      </Typography>

      {/* Loader */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
          <Calendar
            defaultView="week"
            localizer={localizer}
            events={events}
            step={30}
            timeslots={1}
            min={new Date(1970, 1, 1, 7, 0, 0)}
            startAccessor="start"
            endAccessor="end"
            max={new Date(1970, 1, 1, 17, 0, 0)}
            defaultDate={new Date()}
            showMultiDayTimes
            style={{
              height: "80vh", // Adjusting calendar height to make it more responsive
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            views={["week", "day", "agenda"]}
          />
        </Box>
      )}
    </>
  );
}
