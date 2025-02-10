/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/SideBar/Sidebar";
import Header from "../../Components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bar, Pie } from "react-chartjs-2";
import "./style.css";
import dashboardConfig from "./dashboardConfig.json";

// Importing Chart.js components for Bar and Pie charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Importing FontAwesome Icons for dynamic rendering
import {
  faUser,
  faUsers,
  faClipboardList,
  faFileAlt,
  faUserGraduate,
  faClipboardCheck,
  faCreditCard,
  faArrowRight,
  faCalendar,
  faCheckCircle,
  faChalkboard,
  faBell,
  faBook,
  faCoins,
  faPlaneDeparture,
  faTimesCircle,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

// Registering ChartJS modules to use in charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mapping icons dynamically based on the provided icon names
const iconMapping = {
  faUser,
  faUsers,
  faClipboardList,
  faFileAlt,
  faUserGraduate,
  faClipboardCheck,
  faCreditCard,
  faArrowRight,
  faCalendar,
  faCheckCircle,
  faChalkboard,
  faBell,
  faBook,
  faCoins,
  faPlaneDeparture,
  faTimesCircle,
  faCalendarCheck,
};

// Widget component that renders each individual widget on the dashboard
const Widget = ({ title, value, icon, color }) => {
  const iconComponent = iconMapping[icon]; // Mapping the icon dynamically
  if (!iconComponent) {
    console.error(`Icon ${icon} not found`);
    return null; // Return null if no icon is found
  }

  return (
    <div className={`widget ${color}`}>
      <FontAwesomeIcon icon={iconComponent} className="icon" />
      <p>{value}</p>
      <h3>{title}</h3>
    </div>
  );
};

// Main Dashboard component
const Dashboard = ({ role }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeForm, setActiveForm] = useState(null);

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Fetching the dashboard configuration data based on the user role
  useEffect(() => {
    setDashboardData(dashboardConfig[role]);
  }, [role]);

  if (!dashboardData) return <div>Loading...</div>; // Loading state while waiting for data
  if (!dashboardData.forms || !dashboardData.links)
    return <div>Error loading dashboard data.</div>; // Error handling

  const { forms, links, widgets, charts } = dashboardData; // Destructuring data from the config

  // Function to toggle the visibility of forms
  const toggleForm = (form) => {
    setActiveForm(activeForm === form ? null : form);
  };

  // Render the active form based on user interaction
  const renderForm = (form) => {
    const formConfig = forms.find((f) => f.action === form); // Find the corresponding form configuration
    if (!formConfig) return null;

    return (
      <div className="form-container">
        <button className="close-btn" onClick={() => toggleForm(form)}>
          X
        </button>
        <h3>{formConfig.title}</h3>
        <div>
          {formConfig.fields.map((field, index) => {
            // Rendering different input types based on the form field configuration
            switch (field.type) {
              case "text":
              case "number":
                return (
                  <div key={index}>
                    <label>{field.label}:</label>
                    <input type={field.type} placeholder={field.placeholder} />
                  </div>
                );
              case "textarea":
                return (
                  <div key={index}>
                    <label>{field.label}:</label>
                    <textarea placeholder={field.placeholder}></textarea>
                  </div>
                );
              case "select":
                return (
                  <div key={index}>
                    <label>{field.label}:</label>
                    <select>
                      {field.options.map((option, idx) => (
                        <option key={idx} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              default:
                return null;
            }
          })}
          <button type="submit" className="form-button">
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <Header />
      <Sidebar role={role} />
      <div className="main-content admin-dashboard">
        {/* Render Widgets */}
        <div className="widgets">
          {widgets.map((widget, index) => (
            <Widget
              key={index}
              title={widget.title}
              value={widget.value}
              icon={widget.icon}
              color={widget.color}
            />
          ))}
        </div>
        {/* Render Links */}
        <div className="dashboard-links">
          {links.map((link, index) => (
            <div
              className="card"
              key={index}
              onClick={() => toggleForm(link.action)}
            >
              <FontAwesomeIcon icon={iconMapping[link.icon]} size="2x" />
              <p>{link.title}</p>
            </div>
          ))}
        </div>
        {activeForm && renderForm(activeForm)}{" "}
        {/* Conditionally render form based on user interaction */}
        {/* Render Charts */}
        <div className="charts-container">
          <div className="chart-column">
            <h3>{charts.bar.heading} Bar Chart</h3>
            <Bar data={charts.bar} />
          </div>
          <div className="chart-column" style={{ height: "300px" }}>
            <h3>{charts.pie.heading} Pie Chart</h3>
            <Pie data={charts.pie} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
