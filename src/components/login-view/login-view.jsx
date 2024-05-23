import "./login-view.scss"
import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
    };

    fetch(
      "https://spelling-game-ef1de28a171a.herokuapp.com/login?Username=" +
        username +
        "&Password=" +
        password,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    )
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        console.log(data)
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        onLoggedIn(data.user, data.token);
        if (data.user.highScore < localStorage.getItem("localHighScore")) {
          fetch(
            "https://spelling-game-ef1de28a171a.herokuapp.com/users/" + String(data.user.Username),
            {
                method: "PUT",
                body: JSON.stringify({
                  "highScore" : localStorage.getItem("localHighScore")
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
          )
          .then((response) => {
            console.log(response)
          })
        }
      } else {
        alert("No such user");
      }
    })
    .catch((e) => {
      alert("Something went wrong");
      console.log(e)
    });

    
  };

  return (
    <div className="container">
      <Form onSubmit={handleSubmit} style={{width: '750px'}}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
          />
        </Form.Group>
        <br></br>
        <Form.Group controlId="formPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <p></p>
        <button className="button">Submit</button>
        <div style={{fontSize: '0.75em', paddingTop: '0.5em'}}>
          Don't have an account?
        </div>
        <Link to={`/signup`}>
          <div style={{fontSize: '0.75em'}}>
            Sign up here
          </div>
        </Link>
      </Form>
    </div>
  );
};