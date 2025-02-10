import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Login from "./Pages/AuthPages/Login/Login";
import Register from "./Pages/AuthPages/Register/Register";
import Admin from "./Pages/Admin/Admin";
// import Attendance from "./Pages/Admin/components/attendence/Attendance";
import Class from "./Pages/Admin/components/class/Class";
import Dashboard from "./Pages/Admin/components/dashboard/Dashboard";
import Examinations from "./Pages/Admin/components/examinations/Examinations";
import Notice from "./Pages/Admin/components/notice/Notice";
import Schedule from "./Pages/Admin/components/schedule/Schedule";
import Subjects from "./Pages/Admin/components/subjects/Subjects";
import Students from "./Pages/Admin/components/students/Students";
import Teachers from "./Pages/Admin/components/teachers/Teachers";
import Fees from "./Pages/Admin/components/fees/Fees";

import Teacher from "./Pages/Teacher/Teacher";
import TeacherDetails from "./Pages/Teacher/components/teacher details/TeacherDetails";
import ScheduleTeacher from "./Pages/Teacher/components/schedule/ScheduleTeacher";
import AttendanceTeacher from "./Pages/Teacher/components/attendance/AttendanceTeacher";
import ExaminationsTeacher from "./Pages/Teacher/components/examinations/ExaminationsTeacher";
import NoticeTeacher from "./Pages/Teacher/components/notice/NoticeTeacher";

import Student from "./Pages/Student/Student";
import StudentDetails from "./Pages/Student/components/student details/StudentDetails";
import ScheduleStudent from "./Pages/Student/components/schedule/ScheduleStudent";
import AttendanceStudent from "./Pages/Student/components/attendance/AttendanceStudent";
import ExaminationsStudent from "./Pages/Student/components/examinations/ExaminationsStudent";
import NoticeStudent from "./Pages/Student/components/notice/NoticeStudent";
import { AuthProvider } from "./Pages/AuthPages/AuthContext";
import ProtectedRoute from "./Pages/AuthPages/ProtectedRoute";
import AttendanceStudentList from "./Pages/Admin/components/attendence/AttendanceStudentList";
import AttendanceDetails from "./Pages/Admin/components/attendence/AttendanceDetails";

import SignOut from "./Pages/AuthPages/LogOut/SignOut";
import ForgotPassword from "./Pages/AuthPages/forgotPassword/ForgotPassword";
import ChangePassword from "./Pages/Admin/components/password/ChangePassword";
import ResetPassword from "./Pages/AuthPages/forgotPassword/ResetPassword";
import ChangePasswordTeacher from "./Pages/Teacher/components/password/ChangePasswordTeacher";
import ChangePasswordStudent from "./Pages/Student/components/password/ChangePasswordStudent";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-reg" element={<Register />} />
          <Route path="/logout" element={<SignOut />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<AttendanceStudentList />} />
            <Route path="attendance/:id" element={<AttendanceDetails />} />
            <Route path="class" element={<Class />} />
            <Route path="fees" element={<Fees />} />
            <Route path="examinations" element={<Examinations />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="notice" element={<Notice />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>

          {/* Teacher Route */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute>
                <Teacher />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDetails />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
            <Route path="change-password" element={<ChangePasswordTeacher />} />
          </Route>

          {/* Student Route */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute>
                <Student />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDetails />} />
            <Route path="schedule" element={<ScheduleStudent />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="examinations" element={<ExaminationsStudent />} />
            <Route path="notice" element={<NoticeStudent />} />
            <Route path="change-password" element={<ChangePasswordStudent />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
