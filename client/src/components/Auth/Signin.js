import React, { useState, useContext } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";

import { Link, useHistory } from "react-router-dom";

import { UserContext } from "../../App";

import styles from "./Auth.module.css";

export default function Signin() {
  const { state, dispatch } = useContext(UserContext);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex = /^(?=.{8,})/;

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertError, setAlertError] = useState(false);
  const [message, setMessage] = useState("");

  const PostData = async () => {
    if (!emailRegex.test(email)) {
      setAlertError(true);
      setMessage("Invalid email !");
      return;
    }

    if (!passwordRegex.test(password)) {
      setAlertError(true);
      setMessage("Password must be 8 characters or longer!");
      return;
    }

    const data = await fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });

    if (data.error) {
      setAlertError(true);
      setMessage(data.error);
      return;
    } else {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({ type: "USER", payload: data.user });

      toast.success(`Welcome ${data.user.name} !`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        containerId: "A",
      });

      history.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="outlined" className={styles.cardContainer}>
        <CardContent className={styles.authCard}>
          <Typography variant="h2">Login</Typography>

          <form className={styles.formContainer}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />

            <TextField
              type="password"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
            />

            <Button
              variant="contained"
              color="primary"
              style={{ margin: "2rem 0px 1.5rem" }}
              onClick={() => PostData()}
            >
              Login
            </Button>
          </form>

          {alertError ? (
            <Alert
              variant="filled"
              severity="error"
              style={{ marginBottom: "1.5rem" }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertError(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {message}
            </Alert>
          ) : (
            ""
          )}

          <Typography>
            Don't have an account?
            <Link to="/signup" style={{ marginLeft: "0.3rem" }}>
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
