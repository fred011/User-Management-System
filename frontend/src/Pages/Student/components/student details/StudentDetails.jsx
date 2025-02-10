/* eslint-disable no-unused-vars */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import axios from "axios";
import { baseAPI } from "../../../../environment";
import { Box } from "@mui/material";

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // Loading state
  const [token, setToken] = React.useState(localStorage.getItem("token") || ""); // Retrieve token from localStorage

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

      setStudentDetails(response.data.student);
    } catch (error) {
      console.error(
        "Error fetching student details:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  React.useEffect(() => {
    if (token) {
      console.log("Token is available, fetching student details...");
      fetchStudentDetails();
    }
  }, [token]); // Re-fetch if the token changes

  if (loading) {
    return (
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
    );
  }

  if (!studentDetails) {
    return (
      <Typography variant="h6" align="center">
        Failed to load student details. Please try again.
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography
          variant="h4"
          sx={{ color: "#1976d2" }}
          fontWeight={600}
          align="center"
          gutterBottom
        >
          Welcome, {studentDetails.name}!
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableBody>
              {[
                ["Name", studentDetails.name],
                ["Email", studentDetails.email],
                [
                  "Class",
                  studentDetails.student_class
                    ? studentDetails.student_class.class_text
                    : "Not Assigned",
                ],
                ["Age", studentDetails.age],
                ["Gender", studentDetails.gender],
                ["Guardian", studentDetails.guardian],
              ].map(([label, value], index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold" }}>{label}:</TableCell>
                  <TableCell align="right">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
