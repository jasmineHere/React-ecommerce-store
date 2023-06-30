import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import withContext from "../withContext";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    setError("");
  };

  const login = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Fill all fields!");
      return;
    }

    props.context.login(username, password).then((loggedIn) => {
      if (!loggedIn) {
        setError("Invalid Credentials");
      } else {
        navigate("/home"); // Navigate to the desired route
      }
    });
  };

  if (props.context.user) {
    return null; // or render a different component if needed
  }

  return (
    <>
      <div className="hero is-primary ">
        <div className="hero-body container">
          <h4 className="title">Login</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={login}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Email: </label>
              <input
                className="input"
                type="email"
                name="username"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Password: </label>
              <input
                className="input"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            {error && <div className="has-text-danger">{error}</div>}
            <div className="field is-clearfix">
              <button
                className="button is-primary is-outlined is-pulled-right"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default withContext(Login);
