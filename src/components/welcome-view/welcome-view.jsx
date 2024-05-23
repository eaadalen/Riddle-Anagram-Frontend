import "./welcome-view.scss"
import React from "react";
import { Link } from "react-router-dom";

export const WelcomeView = () => {
  return (
    <div className="custom-container">
        <div className="left">Spelling Survival</div>
        <div className="right"> 
          <Link to={`/play`}>
              <p className="button">Start</p>
          </Link>
        </div>
    </div>
  );
};