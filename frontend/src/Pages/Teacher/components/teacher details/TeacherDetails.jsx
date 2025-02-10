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
import axios from "axios";
import { baseAPI } from "../../../../environment";
import CircularProgress from "@mui/material/CircularProgress"; // Import the CircularProgress spinner
import { Box } from "@mui/material";

export default function TeacherDetails() {
  const [teacherDetails, setTeacherDetails] = React.useState(null);
  const [token, setToken] = React.useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = React.useState(true); // Added loading state

  const fetchTeacherDetails = async () => {
    if (!token) {
      console.error("No token available, cannot fetch teacher details");
      return;
    }
    try {
      setLoading(true); // Start loading before making the request
      const response = await axios.get(`${baseAPI}/teacher/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
        withCredentials: true,
      });

      setTeacherDetails(response.data.teacher);
      setLoading(false); // End loading once data is fetched
    } catch (error) {
      console.error(
        "Error fetching teacher details:",
        error.response?.data || error.message
      );
      setLoading(false); // End loading in case of error
    }
  };

  React.useEffect(() => {
    if (token) {
      console.log("Token is available, fetching teacher details...");
      fetchTeacherDetails();
    }
  }, [token]); // Re-fetch if the token changes

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    ); // Show spinner while loading
  }

  if (!teacherDetails) {
    return <Typography variant="h6">No teacher details available.</Typography>;
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
          Welcome, {teacherDetails.name}!
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableBody>
              {[
                ["Name", teacherDetails.name],
                ["Email", teacherDetails.email],
                ["Age", teacherDetails.age],
                ["Gender", teacherDetails.gender],
                ["Qualification", teacherDetails.qualification],
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
