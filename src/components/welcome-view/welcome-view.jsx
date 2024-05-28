import "./welcome-view.scss"
import React from "react";
import { Link } from "react-router-dom";

export const WelcomeView = () => {
  return (
    <div className="custom-container">
        <div className="left">Riddle Scramble</div>
        <div className="right"> 
          <Link to={`/play`}>
              <p className="button">Enter</p>
          </Link>
        </div>
    </div>
  );
};