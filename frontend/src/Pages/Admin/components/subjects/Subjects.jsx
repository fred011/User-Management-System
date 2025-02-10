/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress, // Import CircularProgress for the loader
} from "@mui/material";
import { Form, useFormik } from "formik";

import React, { useEffect, useState } from "react";
import { subjectSchema } from "../../../../Components/yupSchema/subjectSchema";
import axios from "axios";
import { baseAPI } from "../../../../environment";

//Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Subject = () => {
  const [editId, setEditId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  const handleEdit = (id, subject_name, subject_codename) => {
    console.log("Edit", id);
    setEdit(true);
    setEditId(id);
    Formik.setFieldValue("subject_name", subject_name);
    Formik.setFieldValue("subject_codename", subject_codename);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      console.log("Delete", id);
      setLoading(true); // Set loading true when making request
      axios
        .delete(`${baseAPI}/subject/delete/${id}`)
        .then((res) => {
          console.log("Subject delete response", res);
          alert(
            "Subject deleted successfully. Reload the page to see changes."
          );
          fetchAllSubjects();
        })
        .catch((err) => {
          console.log("Error in deleting subject", err);
          alert(err.response?.data?.error || "Failed to delete subject");
        })
        .finally(() => {
          setLoading(false); // Set loading false after request completes
        });
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm(); // Reset form after cancel
  };

  const Formik = useFormik({
    initialValues: { subject_name: "", subject_codename: "" },
    validationSchema: subjectSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Submitting values:", values);
      // Ensure both fields are populated
      if (!values.subject_name || !values.subject_codename) {
        alert("Both subject name and codename are required.");
        return;
      }

      const requestData = { ...values };
      const token = localStorage.getItem("token"); // For authentication
      setLoading(true); // Set loading true when submitting

      if (edit) {
        axios
          .patch(`${baseAPI}/subject/update/${editId}`, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add token to the headers
            },
          })
          .then((res) => {
            console.log("Subject update response", res);
            alert("Subject updated successfully");
            cancelEdit();
            fetchAllSubjects();
          })
          .catch((err) => {
            console.log(
              "Error in updating subject",
              err.response?.data || err.message
            );
            alert(err.response?.data?.error || "Failed to update subject");
          })
          .finally(() => {
            setLoading(false); // Set loading false after request completes
          });
      } else {
        axios
          .post(`${baseAPI}/subject/create`, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add token to the headers
            },
          })
          .then((res) => {
            console.log("Subject add response", res);
            alert("Subject added successfully");
            resetForm();
            fetchAllSubjects();
          })
          .catch((err) => {
            console.log(
              "Error in adding subject",
              err.response?.data || err.message
            );
            alert(err.response?.data?.error || "Failed to add subject");
          })
          .finally(() => {
            setLoading(false); // Set loading false after request completes
          });
      }
    },
  });

  const fetchAllSubjects = () => {
    const token = localStorage.getItem("token"); // Add token for authentication
    setLoading(true); // Set loading true when fetching
    axios
      .get(`${baseAPI}/subject/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the request headers
        },
      })
      .then((res) => {
        console.log("Fetched subjects", res.data);
        setSubjects(res.data.data);
      })
      .catch((err) => {
        console.log("Error in fetching all subjects", err);
        alert("Failed to fetch subjects");
      })
      .finally(() => {
        setLoading(false); // Set loading false after request completes
      });
  };

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", fontWeight: "700", mb: 4 }}
      >
        Subjects
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "600px",
              margin: "auto",
              background: "#fff",
              padding: 3,
              borderRadius: 2,
              boxShadow: 2,
            }}
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
          >
            {edit ? (
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: "700",
                  mb: 2,
                  color: "#1976d2",
                }}
              >
                Edit Subject
              </Typography>
            ) : (
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: "700",
                  mb: 2,
                  color: "#1976d2",
                }}
              >
                Add New Subject
              </Typography>
            )}

            <TextField
              name="subject_name"
              label="Subject Name"
              value={Formik.values.subject_name}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              sx={{ mb: 2 }}
            />
            {Formik.touched.subject_name && Formik.errors.subject_name && (
              <Typography sx={{ color: "red", fontSize: "0.875rem", mb: 2 }}>
                {Formik.errors.subject_name}
              </Typography>
            )}

            <TextField
              name="subject_codename"
              label="Subject Codename"
              value={Formik.values.subject_codename}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              sx={{ mb: 2 }}
            />
            {Formik.touched.subject_codename &&
              Formik.errors.subject_codename && (
                <Typography sx={{ color: "red", fontSize: "0.875rem", mb: 2 }}>
                  {Formik.errors.subject_codename}
                </Typography>
              )}

            <Button
              sx={{ width: "120px", alignSelf: "center" }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>

            {edit && (
              <Button
                sx={{ width: "120px", alignSelf: "center", mt: 2 }}
                onClick={cancelEdit}
                type="button"
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <TableContainer
            component={Paper}
            sx={{ marginTop: 3, borderRadius: 2, boxShadow: 2 }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="subjects table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Subject Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Subject Codename
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects &&
                  subjects.map((subject) => (
                    <TableRow key={subject._id}>
                      <TableCell>{subject.subject_name}</TableCell>
                      <TableCell>{subject.subject_codename}</TableCell>
                      <TableCell align="center">
                        <Button
                          onClick={() =>
                            handleEdit(
                              subject._id,
                              subject.subject_name,
                              subject.subject_codename
                            )
                          }
                          sx={{ mr: 2 }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          onClick={() => handleDelete(subject._id)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default Subject;
