/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
  CircularProgress, // Import CircularProgress for loader
} from "@mui/material";
import ScheduleEvent from "./ScheduleEvent";
import axios from "axios";
import { baseAPI } from "../../../../environment";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newPeriod, setNewPeriod] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false); // State for loading classes
  const [loadingSchedule, setLoadingSchedule] = useState(false); // State for loading schedule
  const [edit, setEdit] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: History, Teacher: Harry",
      start: new Date(date.setHours(9, 30)),
      end: new Date(date.setHours(11, 30)),
    },
  ];

  const handleEventClose = () => {
    setNewPeriod(false);
    setEdit(false);
    setSelectedEventId(null);
  };

  const handleSelectEvent = (event) => {
    setEdit(true);
    setSelectedEventId(event.id);
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
    setLoadingClasses(true); // Set loading to true when fetching classes
    axios
      .get(`${baseAPI}/class/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      })
      .then((res) => {
        setClasses(res.data.data);
        setSelectedClass(res.data.data[0]._id);
        console.log("Fetched classes : ", res.data.data);
        setLoadingClasses(false); // Set loading to false once classes are fetched
      })
      .catch((e) => {
        console.log("Fetch class error", e);
        setLoadingClasses(false); // Set loading to false in case of error
      });
  }, []);

  const fetchSchedule = (selectedClass) => {
    if (selectedClass) {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
      setLoadingSchedule(true); // Set loading to true when fetching schedule
      console.log("Fetching schedules for class:", selectedClass);

      axios
        .get(`${baseAPI}/schedule/fetch-with-class/${selectedClass}`, {
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
          setLoadingSchedule(false); // Set loading to false once schedule is fetched
        })
        .catch((err) => {
          console.log(
            "Error in fetching schedule: ",
            err.response?.data || err
          );
          setLoadingSchedule(false); // Set loading to false in case of error
        });
    }
  };

  useEffect(() => {
    fetchSchedule(selectedClass);
  }, [selectedClass]);

  const handleAddNewPeriod = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setNewPeriod(false);
  };

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
        Schedule
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "500",
          color: "#1976d2",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        Class
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        {loadingClasses ? ( // Show loader if classes are being loaded
          <CircularProgress
            size={24}
            sx={{ marginLeft: "auto", marginRight: "auto" }}
          />
        ) : (
          <Select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          >
            {classes &&
              classes.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.class_text}
                </MenuItem>
              ))}
          </Select>
        )}
      </FormControl>

      <Box sx={{ textAlign: "center", marginBottom: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setNewPeriod(true)}
          sx={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Add new Period
        </Button>
      </Box>

      {(newPeriod || edit) && (
        <ScheduleEvent
          selectedClass={selectedClass}
          handleEventClose={handleEventClose}
          onAddNewPeriod={handleAddNewPeriod}
          edit={edit}
          selectedEventId={selectedEventId}
        />
      )}

      {loadingSchedule ? ( // Show loader if schedule is being loaded
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
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
            onSelectEvent={handleSelectEvent}
            max={new Date(1970, 1, 1, 17, 0, 0)}
            defaultDate={new Date()}
            showMultiDayTimes
            style={{
              height: "80vh",
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
