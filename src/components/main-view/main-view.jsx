import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { WelcomeView } from "../welcome-view/welcome-view";
import { TestView } from "../test-view/test-view";
import { Col, Row } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayView } from "../play-view/play-view";

export const MainView = () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  return (
    <BrowserRouter>
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <WelcomeView/>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/play" />
                ) : (
                  <Col md={5}>
                    <LoginView onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/play" />
                ) : (
                  <Col md={12}>
                    <SignupView onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/play"
            element={
              <>
                <PlayView/>
              </>
            }
          />
          <Route
            path="/test"
            element={
              <>
                <TestView/>
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};