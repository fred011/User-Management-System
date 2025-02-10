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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { classSchema } from "../../../../Components/yupSchema/classSchema";
import axios from "axios";
import { baseAPI } from "../../../../environment";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Class = () => {
  const [editId, setEditId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [submitting, setSubmitting] = useState(false); // Loading state for form submission

  // Fetch all classes
  const fetchAllClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseAPI}/class/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(res.data.data || []);
    } catch (err) {
      console.error(
        "Error fetching classes",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  const handleEdit = (id, class_text, class_num) => {
    setEdit(true);
    setEditId(id);
    formik.setFieldValue("class_text", class_text);
    formik.setFieldValue("class_num", class_num);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseAPI}/class/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Class deleted successfully.");
      fetchAllClasses();
    } catch (err) {
      console.error("Error deleting class", err);
      alert("Failed to delete class.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: { class_text: "", class_num: "" },
    validationSchema: classSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const token = localStorage.getItem("token");

        if (edit) {
          await axios.patch(`${baseAPI}/class/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert("Class updated successfully.");
          cancelEdit();
        } else {
          await axios.post(`${baseAPI}/class/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert("Class added successfully.");
          resetForm();
        }

        fetchAllClasses();
      } catch (err) {
        console.error("Error processing class", err);
        alert("Operation failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", fontWeight: "700", mb: 3 }}
      >
        Classes
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "90%", sm: "60%" },
          margin: "auto",
          padding: 3,
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            mb: 2,
            color: "#1976d2",
          }}
        >
          {edit ? "Edit Class" : "Add New Class"}
        </Typography>

        <TextField
          name="class_text"
          label="Class Text"
          value={formik.values.class_text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.class_text && Boolean(formik.errors.class_text)}
          helperText={formik.touched.class_text && formik.errors.class_text}
          fullWidth
        />

        <TextField
          name="class_num"
          label="Class Number"
          value={formik.values.class_num}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.class_num && Boolean(formik.errors.class_num)}
          helperText={formik.touched.class_num && formik.errors.class_num}
          fullWidth
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: edit ? "space-between" : "center",
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "120px" }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>

          {edit && (
            <Button
              onClick={cancelEdit}
              variant="outlined"
              color="secondary"
              sx={{ width: "120px" }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Loader for Fetching Classes */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Class Text
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Class Number
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((x) => (
                <TableRow
                  key={x._id}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>{x.class_text}</TableCell>
                  <TableCell>{x.class_num}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleEdit(x._id, x.class_text, x.class_num)
                      }
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(x._id)}
                      aria-label="delete"
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Class;
