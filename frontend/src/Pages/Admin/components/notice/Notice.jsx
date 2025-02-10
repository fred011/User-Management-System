/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { noticeSchema } from "../../../../Components/yupSchema/noticeSchema";
import axios from "axios";
import { baseAPI } from "../../../../environment";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Notice = () => {
  const [editId, setEditId] = useState(null);
  const [notices, setNotices] = useState([]);
  const [edit, setEdit] = useState(false);
  const [filterAudience, setFilterAudience] = useState("all");
  const [loading, setLoading] = useState(false); // State for loader
  const [submitLoading, setSubmitLoading] = useState(false); // State for form submission loader

  const handleEdit = (id, title, message, audience) => {
    console.log("Edit", id);
    setEdit(true);
    setEditId(id);
    formik.setFieldValue("title", title);
    formik.setFieldValue("message", message);
    formik.setFieldValue("audience", audience);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
    if (confirm("Are you sure you want to delete this notice?")) {
      console.log("Delete", id);
      setLoading(true); // Show loader while deleting
      axios
        .delete(`${baseAPI}/notice/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        })
        .then((res) => {
          console.log("Notice delete response", res);
          alert("Notice deleted successfully, reload the page to see changes");
          fetchAllNotices();
        })
        .catch((err) => {
          console.log("Error in deleting notice", err);
          alert("Failed to delete notice");
        })
        .finally(() => setLoading(false)); // Hide loader after request
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: { title: "", message: "", audience: "" },
    validationSchema: noticeSchema,
    onSubmit: (values, { resetForm }) => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
      console.log(values);

      setSubmitLoading(true); // Show loader during form submission

      if (edit) {
        axios
          .patch(
            `${baseAPI}/notice/update/${editId}`,
            { ...values },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include token in the request header
              },
            }
          )
          .then((res) => {
            console.log("Notice update response", res);
            alert("Notice updated successfully");
            cancelEdit();
            fetchAllNotices();
          })
          .catch((err) => {
            console.log(
              "Error in updating notice",
              err.response ? err.response.data : err.message
            );
            alert("Failed to update notice");
          })
          .finally(() => setSubmitLoading(false)); // Hide loader after request
      } else {
        axios
          .post(
            `${baseAPI}/notice/create`,
            { ...values },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include token in the request header
              },
            }
          )
          .then((res) => {
            console.log("Notice add response", res);
            alert("Notice added successfully");
            resetForm();
            fetchAllNotices();
          })
          .catch((err) => {
            console.log(
              "Error in adding notice",
              err.response ? err.response.data : err.message
            );
            alert("Failed to add notice");
          })
          .finally(() => setSubmitLoading(false)); // Hide loader after request

        resetForm();
      }
    },
  });

  const fetchAllNotices = () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage or context
    setLoading(true); // Show loader while fetching notices

    axios
      .get(`${baseAPI}/notice/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      })
      .then((res) => {
        console.log("Notices", res.data);
        setNotices(res.data.data);
      })
      .catch((err) => {
        console.log("Error in fetching all notices", err);
      })
      .finally(() => setLoading(false)); // Hide loader after request
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  // Filter notices based on audience
  const filteredNotices = notices.filter(
    (notice) => filterAudience === "all" || notice.audience === filterAudience
  );

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "700",
          color: "primary.main",
          mb: 3,
        }}
      >
        Notices
      </Typography>

      {loading && (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "90vw", sm: "70vw", md: "60vw" },
          maxWidth: 600,
          margin: "auto",
          background: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          gap: 2,
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            color: edit ? "warning.main" : "primary.main",
          }}
        >
          {edit ? "Edit Notice" : "Add New Notice"}
        </Typography>

        <TextField
          fullWidth
          name="title"
          label="Title"
          variant="outlined"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <TextField
          fullWidth
          multiline
          rows={5}
          name="message"
          label="Message"
          variant="outlined"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
        />

        <FormControl
          fullWidth
          variant="outlined"
          error={formik.touched.audience && Boolean(formik.errors.audience)}
        >
          <InputLabel>Audience</InputLabel>
          <Select
            value={formik.values.audience}
            name="audience"
            label="Audience"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value={""}>Select Audience</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"student"}>Student</MenuItem>
          </Select>
          {formik.touched.audience && formik.errors.audience && (
            <Typography color="error" variant="caption">
              {formik.errors.audience}
            </Typography>
          )}
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            {submitLoading ? (
              <CircularProgress size={24} />
            ) : edit ? (
              "Update"
            ) : (
              "Submit"
            )}
          </Button>

          {edit && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              sx={{ minWidth: 120 }}
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          backgroundColor: "grey.100",
          borderRadius: 2,
          boxShadow: 1,
          my: 2,
        }}
      >
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Notice For{" "}
            <Box
              component="span"
              sx={{
                ml: 1,
                color: "primary.main",
                textTransform: "uppercase",
              }}
            >
              {filterAudience}
            </Box>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant={filterAudience === "student" ? "contained" : "outlined"}
            onClick={() => setFilterAudience("student")}
            sx={{
              minWidth: 150,
              textTransform: "uppercase",
            }}
          >
            Student Notices
          </Button>
          <Button
            variant={filterAudience === "teacher" ? "contained" : "outlined"}
            onClick={() => setFilterAudience("teacher")}
            sx={{
              minWidth: 150,
              textTransform: "uppercase",
            }}
          >
            Teacher Notices
          </Button>
          <Button
            variant={filterAudience === "all" ? "contained" : "outlined"}
            onClick={() => setFilterAudience("all")}
            sx={{
              minWidth: 150,
              textTransform: "uppercase",
            }}
          >
            All Notices
          </Button>
        </Box>
      </Box>

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
        {filteredNotices?.map((notice) => (
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={() =>
                  handleEdit(
                    notice._id,
                    notice.title,
                    notice.message,
                    notice.audience
                  )
                }
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(notice._id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default Notice;
