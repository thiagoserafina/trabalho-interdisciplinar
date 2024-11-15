import React from "react";
import "./styles.css";

const SidebarComponent = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__wrapper">
        <div className="sidebar__logo">Logo</div>
        <div className="sidebar__menu">
          <a href="/students">Students</a>
          <a href="/calendar">Calendar</a>
          <a href="/settings">Settings</a>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
