/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import { useFormik } from "formik";
import { periodSchema } from "../../../../Components/yupSchema/periodSchema";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseAPI } from "../../../../environment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ScheduleEvent({
  selectedClass,
  handleEventClose,
  edit,
  selectedEventId,
  setEvents, // Ensure setEvents is passed as a prop from the parent component
}) {
  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: new Date(),
  };
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

  const periods = [
    {
      id: 1,
      label: "Period 1 (08:00 AM - 09:00 AM)",
      startTime: "08:00",
      endTime: "09:00",
    },
    {
      id: 2,
      label: "Period 2 (09:00 AM - 10:00 AM)",
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      id: 3,
      label: "Period 3 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 4,
      label: "Lunch Break (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 5,
      label: "Period 4 (12:00 PM - 13:00 PM)",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 6,
      label: "Period 5 (13:00 PM - 14:00 PM)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 7,
      label: "Period 6 (14:00 PM - 15:00 PM)",
      startTime: "14:00",
      endTime: "15:00",
    },
  ];

  const handleCancel = () => {
    formik.resetForm();
    handleEventClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this period?")) {
      const token = localStorage.getItem("token"); // Include token for authentication
      setLoading(true); // Start loader
      axios
        .delete(`${baseAPI}/schedule/delete/${selectedEventId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        })
        .then((res) => {
          alert("Event Deleted Successfully");
          console.log("Event Deleted Successfully", res);

          handleCancel();
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== selectedEventId)
          );
        })
        .catch((e) => {
          alert("Failed to delete Event");
          console.log("Failed to delete Event", e);
        })
        .finally(() => setLoading(false)); // Stop loader
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: (values, { resetForm }) => {
      const { date, period } = values;
      const [startTime, endTime] = period.split(",");
      const selectedDate = dayjs(date);

      if (!selectedDate.isValid()) {
        alert("Invalid date selected.");
        return;
      }

      const formattedStartTime = selectedDate
        .hour(parseInt(startTime.split(":")[0], 10))
        .minute(parseInt(startTime.split(":")[1], 10))
        .toDate();

      const formattedEndTime = selectedDate
        .hour(parseInt(endTime.split(":")[0], 10))
        .minute(parseInt(endTime.split(":")[1], 10))
        .toDate();

      const formattedData = {
        ...values,
        selectedClass,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };

      const token = localStorage.getItem("token"); // Include token for authentication
      setLoading(true); // Start loader
      if (edit) {
        axios
          .post(
            `${baseAPI}/schedule/update/${selectedEventId}`,
            formattedData,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add token to headers
              },
            }
          )
          .then((res) => {
            console.log("API Response:", res.data);
            alert("Period Updated successfully");
            resetForm();
            handleEventClose();
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event.id === selectedEventId
                  ? {
                      ...event,
                      title: `Subject: ${values.subject.subject_name}, Teacher: ${values.teacher.name}`,
                      start: formattedStartTime,
                      end: formattedEndTime,
                    }
                  : event
              )
            );
          })
          .catch((e) => {
            console.error("Error updating period:", e);
            alert("Failed to update period");
          })
          .finally(() => setLoading(false)); // Stop loader
      } else {
        axios
          .post(`${baseAPI}/schedule/create`, formattedData, {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to headers
            },
          })
          .then((res) => {
            console.log("API Response:", res.data);
            alert("Period created successfully");
            resetForm();
            handleEventClose();
            setEvents((prevEvents) => [
              ...prevEvents,
              {
                id: res.data.id,
                title: `Subject: ${values.subject.subject_name}, Teacher: ${values.teacher.name}`,
                start: formattedStartTime,
                end: formattedEndTime,
              },
            ]);
          })
          .catch((e) => {
            console.error("Error creating period:", e);
            alert("Failed to create period");
          })
          .finally(() => setLoading(false)); // Stop loader
      }
    },
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Include token for fetching data
      const teacherResponse = await axios.get(
        `${baseAPI}/teacher/fetch-with-query`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const subjectResponse = await axios.get(`${baseAPI}/subject/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Teachers:", teacherResponse.data);
      console.log("Fetched Subjects:", subjectResponse.data);

      setTeachers(teacherResponse.data.teachers || []);
      setSubjects(subjectResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass]);

  const dateFormat = (date) => {
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();
    return `${dateHours < 10 ? "0" : ""}${dateHours}:${
      dateMinutes < 10 ? "0" : ""
    }${dateMinutes}`;
  };

  useEffect(() => {
    const fetchEventData = async () => {
      if (selectedEventId) {
        try {
          const token = localStorage.getItem("token"); // Include token for event fetch
          const res = await axios.get(
            `${baseAPI}/schedule/fetch/${selectedEventId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const eventData = res.data.data;

          formik.setFieldValue("teacher", eventData.teacher);
          formik.setFieldValue("subject", eventData.subject);

          const start = new Date(eventData.startTime);
          const end = new Date(eventData.endTime);

          formik.setFieldValue("date", start);

          const finalFormattedTime = dateFormat(start) + "," + dateFormat(end);
          formik.setFieldValue("period", finalFormattedTime);

          console.log("RESPONSE:", res);
        } catch (e) {
          console.error("ERROR Fetching with ID:", e);
        }
      }
    };

    fetchEventData();
  }, [selectedEventId]);

  return (
    <>
      <Card
        sx={{
          width: "70vw",
          maxWidth: 600,
          margin: "20px auto",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", marginBottom: 2, fontWeight: "600" }}
          >
            {edit ? "Edit Period" : "Add New Period"}
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <FormControl fullWidth>
              <InputLabel>Teacher</InputLabel>
              <Select
                value={formik.values.teacher}
                name="teacher"
                label="Teacher"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {teachers.map((x) => (
                  <MenuItem key={x._id} value={x._id}>
                    {x.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.teacher && formik.errors.teacher && (
                <Typography color="error" variant="caption">
                  {formik.errors.teacher}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={formik.values.subject}
                name="subject"
                label="Subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {subjects.map((x) => (
                  <MenuItem key={x._id} value={x._id}>
                    {x.subject_name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.subject && formik.errors.subject && (
                <Typography color="error" variant="caption">
                  {formik.errors.subject}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select
                value={formik.values.period}
                name="period"
                label="Period"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {periods.map((x) => (
                  <MenuItem key={x.id} value={`${x.startTime},${x.endTime}`}>
                    {x.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.period && formik.errors.period && (
                <Typography color="error" variant="caption">
                  {formik.errors.period}
                </Typography>
              )}
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={formik.values.date ? dayjs(formik.values.date) : null}
                onChange={(value) =>
                  formik.setFieldValue("date", value.toDate())
                }
              />
            </LocalizationProvider>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ background: "green", flex: 1 }}
              >
                {edit ? "Update Event" : "Add Event"}
              </Button>
              {edit && (
                <Button
                  type="button"
                  variant="contained"
                  sx={{ background: "red", flex: 1 }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                sx={{ flex: 1 }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
