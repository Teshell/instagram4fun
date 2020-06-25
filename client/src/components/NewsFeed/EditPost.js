import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import { useTheme } from "@material-ui/core/styles";

import { UserContext } from "../../App";

import EditIcon from "@material-ui/icons/Edit";
import { Typography } from "@material-ui/core";

export default function EditPost({ post }) {
  const { state, dispatch } = useContext(UserContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [text, setText] = useState(post.body);

  const [open, setOpen] = useState(false);

  const updatePost = async (postId) => {
    const result = await fetch(`/editpost/${postId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
      }),
    }).then((res) => res.json());
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
        <DialogContent style={{ width: "350px", height: "100px" }}>
          <TextareaAutosize
            autoFocus
            aria-label="minimum height"
            rowsMin={5}
            value={text}
            onChange={handleTextChange}
            style={{ width: "320px", resize: "none" }}
          />
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              color="primary"
              onClick={handleClose}
              style={{ textTransform: "none" }}
            >
              Cancel
            </Button>

            {text !== "" && text !== post.body ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updatePost(post._id);
                  handleClose();
                }}
                style={{ textTransform: "none" }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled
                style={{ textTransform: "none" }}
              >
                Save
              </Button>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
