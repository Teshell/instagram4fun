import React, { useState, useEffect } from "react";

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

import SendIcon from "@material-ui/icons/Send";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import CloseIcon from "@material-ui/icons/Close";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import CardMedia from "@material-ui/core/CardMedia";

import { useHistory } from "react-router-dom";

import styles from "./CreatePost.module.css";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const history = useHistory();

  const [alertError, setAlertError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setAlertError(true);
            setMessage(data.error);
          } else {
            toast.success("Your post is created !", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });

            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }

    setLoading(false);
  }, [url]);

  const postDetails = () => {
    setLoading(true);
    const data = new FormData();

    data.append("file", image);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "dx4govbm1");

    fetch("https://api.cloudinary.com/v1_1/dx4govbm1/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const handleImageChange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);

    reader.onload = (e) => {
      setImage(reader.result);
    };
  };

  return (
    <div className={styles.container}>
      <Card variant="outlined" className={styles.cardContainer}>
        <CardContent className={styles.cardContent}>
          <Typography style={{ fontSize: "2.5em" }}>Create a Post</Typography>

          {image ? (
            <img
              alt="post"
              src={image}
              width="30%"
              height="30%"
              style={{ alignSelf: "center", marginTop: "2rem" }}
            />
          ) : (
            <h1>No Image</h1>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "2rem 0 1rem 0",
            }}
          >
            <TextareaAutosize
              autoFocus
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-label="minimum height"
              rowsMin={3}
              placeholder="Write something..."
              style={{ width: "320px", resize: "none", outline: "none" }}
            />

            <Button
              style={{ marginLeft: "1.5rem" }}
              variant="outlined"
              component="label"
            >
              <PhotoCameraIcon></PhotoCameraIcon>
              <input
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Button>
          </div>

          {alertError ? (
            <Alert
              variant="filled"
              severity="error"
              style={{ marginBottom: "0.7rem" }}
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

          {body !== "" && image !== "" && !loading ? (
            <Button variant="outlined" onClick={() => postDetails()}>
              Submit
              <SendIcon style={{ marginLeft: "0.4rem" }}></SendIcon>
            </Button>
          ) : (
            <Button variant="outlined" disabled>
              Submit
              <SendIcon style={{ marginLeft: "0.4rem" }}></SendIcon>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
