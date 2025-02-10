import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTachometerAlt,
  FaBook,
  FaUserEdit,
  FaPlusSquare,
  FaEdit,
  FaDollarSign,
  FaFolder,
  FaBell,
  FaHandshake,
  FaUserGraduate,
  FaSignOutAlt,
  FaPlaneDeparture,
  FaChartLine,
  FaCalendarAlt,
  FaComments,
  FaBookOpen,
  FaCalendarCheck,
  FaCheckSquare,
  FaChalkboardTeacher,
  FaUserFriends,
  FaExclamationTriangle,
  FaChartPie,
  FaUserTie,
  FaClipboardList,
  FaBullhorn,
  FaFolderOpen,
  FaChartBar,
} from "react-icons/fa";

import "./style.css"; // Import updated CSS

const Sidebar = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sidebar links based on role
  const links = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
      {
        name: "Teachers",
        path: "/admin/teachers",
        icon: <FaChalkboardTeacher />,
      },
      { name: "Students", path: "/admin/students", icon: <FaUserGraduate /> },
      { name: "Admissions", path: "/admin/admissions", icon: <FaFolderOpen /> },
      { name: "Fees", path: "/admin/fees", icon: <FaDollarSign /> },
      { name: "Reports", path: "/admin", icon: <FaChartBar /> },
      { name: "Notice", path: "/admin", icon: <FaBullhorn /> },
      {
        name: "Recent Applications",
        path: "/admin",
        icon: <FaClipboardList />,
      },
      {
        name: "Upcoming Payment Deadlines",
        path: "/admin",
        icon: <FaCalendarAlt />,
      },
      {
        name: "Admission Officer Assignments",
        path: "/admin",
        icon: <FaUserTie />,
      },
      {
        name: "Student Enrollment Chart",
        path: "/admin",
        icon: <FaChartPie />,
      },
      {
        name: "System Alerts",
        path: "/admin",
        icon: <FaExclamationTriangle />,
      },
      { name: "Behavior Tracking", path: "/admin/behavior", icon: <FaBell /> },
      { name: "Library", path: "/admin/library", icon: <FaBook /> },
      {
        name: "Sponsorship",
        path: "/admin/sponsorship",
        icon: <FaHandshake />,
      },
      { name: "Alumni", path: "/admin/alumni", icon: <FaUserFriends /> },
    ],
    teacher: [
      { name: "Home", path: "/teacher", icon: <FaHome /> },
      { name: "Students", path: "/teacher/students", icon: <FaUserGraduate /> },
      {
        name: "Behavior Tracking",
        path: "/teacher/behavior",
        icon: <FaBell />,
      },
      { name: "Library", path: "/teacher/library", icon: <FaBook /> },
      { name: "Update Profile", path: "/teacher", icon: <FaUserEdit /> },
      { name: "Add Result", path: "/teacher", icon: <FaPlusSquare /> },
      { name: "Edit Result", path: "/teacher", icon: <FaEdit /> },
      { name: "Resources", path: "/teacher", icon: <FaFolder /> },
      { name: "Take Attendance", path: "/teacher", icon: <FaCheckSquare /> },
      {
        name: "View/Update Attendance",
        path: "/teacher",
        icon: <FaCalendarCheck />,
      },
      { name: "View Notifications", path: "/teacher", icon: <FaBell /> },
      { name: "Apply For Leave", path: "/teacher", icon: <FaPlaneDeparture /> },
      { name: "Logout", path: "/teacher", icon: <FaSignOutAlt /> },
    ],
    student: [
      { name: "Home", path: "/student", icon: <FaHome /> },
      { name: "Update Profile", path: "/student", icon: <FaUserEdit /> },
      { name: "View Attendance", path: "/student", icon: <FaCalendarCheck /> },
      { name: "Courses", path: "/student", icon: <FaBookOpen /> },
      { name: "Grades", path: "/student", icon: <FaChartLine /> },
      { name: "View Notifications", path: "/student", icon: <FaBell /> },
      { name: "Feedback", path: "/student", icon: <FaComments /> },
      { name: "Schedule", path: "/student/schedule", icon: <FaCalendarAlt /> },
      { name: "Fees", path: "/student/fees", icon: <FaDollarSign /> },
      { name: "Library", path: "/student/library", icon: <FaBook /> },
      { name: "Logout", path: "/student", icon: <FaSignOutAlt /> },
    ],
  };

  // Toggle the sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {/* Logo and Company Name */}
        <div className="logo">
          <FaUserGraduate size="2x" />
        </div>
        {/* Sidebar Collapse Button */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? "➤" : "◀"}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="sidebar-links">
        {links[role].map((link, index) => (
          <li key={index} className="text-dark">
            <Link to={link.path} data-tooltip={link.name}>
              {link.icon}
              {!isCollapsed && <span>{link.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  role: PropTypes.oneOf(["admin", "teacher", "student"]).isRequired,
};

export default Sidebar;
