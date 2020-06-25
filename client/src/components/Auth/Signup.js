import React, { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Link, useHistory } from "react-router-dom";

import styles from "./Auth.module.css";

export default function Signup() {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex = /^(?=.{8,})/;

  const history = useHistory();

  const [name, setName] = useState("");
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

    const data = await fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });

    if (data.err) {
      setAlertError(true);
      setMessage(data.err);
    } else {
      history.push("/signin");
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="outlined" className={styles.cardContainer}>
        <CardContent className={styles.authCard}>
          <Typography variant="h2">Signup</Typography>

          <form className={styles.formContainer}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputField}
            />

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
              onClick={() => PostData()}
              color="primary"
              style={{ margin: "2rem 0px 1.5rem" }}
            >
              Signup
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
            Already have an account?
            <Link to="/signin" style={{ marginLeft: "0.3rem" }}>
              Log In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
