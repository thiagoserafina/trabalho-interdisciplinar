import React from "react";
import "./styles.css";

const TopBarComponent = () => {
  return (
    <div className="topbar">
      <div className="topbar__wrapper">
        <div className="topbar__logo">Logo</div>
        <div className="topbar__menu">
          <a href="/students">Students</a>
          <a href="/calendar">Calendar</a>
          <a href="/settings">Settings</a>
        </div>
      </div>
    </div>
  );
};

export default TopBarComponent;
