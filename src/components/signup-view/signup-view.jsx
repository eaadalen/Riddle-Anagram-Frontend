import { useState } from "react";
import Form from "react-bootstrap/Form";

export const SignupView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault()

    const data = {
      Username: username,
      Password: password,
      highScore: localStorage.getItem("localHighScore")
    };

    fetch(
        "https://spelling-game-ef1de28a171a.herokuapp.com/users",
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json"
            }
        }
    )
    .then((response) => {
        if (response.status == 201) {
            response.json()
            .then(() => {
                fetch(
                    "https://spelling-game-ef1de28a171a.herokuapp.com/login?Username=" +
                        data.Username +
                        "&Password=" +
                        data.Password,
                    {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                )
                .then((response) => response.json())
                .then((dataV1) => {
                    if (dataV1.user) {
                        localStorage.setItem("user", JSON.stringify(dataV1.user));
                        localStorage.setItem("token", dataV1.token);
                        onLoggedIn(dataV1.user, dataV1.token);
                    } else {
                        alert("No such user");
                    }
                })
                .catch((e) => {
                    alert("Something went wrong");
                    console.log(e)
                });
            })
        }
        else {
            alert("Username is already taken")
        }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
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
      <br></br>
      <button className="button">Submit</button>
    </Form>
  );
};