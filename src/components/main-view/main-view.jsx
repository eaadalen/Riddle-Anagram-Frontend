import { useState } from "react";
import { Row } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
                <PlayView/>
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};