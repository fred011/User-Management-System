import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons"; // Example icon, you can choose any
import "./style.css";

// eslint-disable-next-line react/prop-types
const Header = ({ userName }) => {
  userName = "Thabo James Humphrey";
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="header">
      {/* Left Section: Icon and System Name */}
      <div className="left">
        <FontAwesomeIcon icon={faRocket} size="lg" />
        <h2>Learner Management System</h2>
      </div>

      {/* Center Section: Search Bar */}
      <div className="center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Right Section: Scrolling User's Name */}
      <div className="right">
        <div className="scrolling-name">
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
