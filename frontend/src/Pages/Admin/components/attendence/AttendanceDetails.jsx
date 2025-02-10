import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseAPI } from "../../../../environment";
import axios from "axios";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const AttendanceDetails = () => {
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentName, setStudentName] = useState(""); // For student name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id: studentId } = useParams();
  const navigate = useNavigate();

  // Utility function to format date
  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        setError("Authorization token is missing");
        setLoading(false);
        return;
      }

      // Fetch student attendance data including student name
      const response = await axios.get(`${baseAPI}/attendance/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        console.error("Invalid data format:", response.data);
        setError("Invalid data format received");
        setLoading(false);
        return;
      }

      // Set the attendance data
      setAttendanceData(response.data);
      setStudentName(response.data[0]?.student?.name); // Accessing student's name
      setPresent(response.data.filter((a) => a.status === "present").length);
      setAbsent(response.data.filter((a) => a.status === "absent").length);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(err.message);
      navigate("/admin/attendance"); // Redirect on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendanceData();
    } else {
      setError("Invalid student ID provided.");
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <div>
          <CircularProgress />
        </div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      {attendanceData.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No attendance records found.
        </Typography>
      ) : (
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
            Attendance Details for: {studentName}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Item>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Attendance Overview
                </Typography>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: present, label: "Present" },
                        { id: 1, value: absent, label: "Absent" },
                      ],
                    },
                  ]}
                  width={400}
                  height={250}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Total Attendance Records
                </Typography>
              </Item>
            </Grid>

            <Grid item xs={12} md={6}>
              <Item>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Attendance Records
                </Typography>
                <TableContainer component={Paper} elevation={1}>
                  <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.length > 0 ? (
                        attendanceData.map((attendance) => (
                          <TableRow
                            key={attendance._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                              backgroundColor:
                                attendance.status === "present"
                                  ? "rgba(76, 175, 80, 0.1)"
                                  : "rgba(244, 67, 54, 0.1)",
                              "&:hover": {
                                backgroundColor:
                                  attendance.status === "present"
                                    ? "rgba(76, 175, 80, 0.2)"
                                    : "rgba(244, 67, 54, 0.2)",
                              },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {convertDate(attendance.date)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                fontWeight: "bold",
                                color:
                                  attendance.status === "present"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {attendance.status}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            No attendance records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Item>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default AttendanceDetails;
