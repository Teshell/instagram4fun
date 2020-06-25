import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import DialogTitle from "@material-ui/core/DialogTitle";

export default function DeleteProfile() {
  const [open, setOpen] = React.useState(false);

  const history = useHistory();

  const { state, dispatch } = useContext(UserContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deletePosts = async () => {
    await fetch(`/deleteposts`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => res.json());
  };

  const deleteProfile = async (userId) => {
    await fetch(`/deleteProfile/${userId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => res.json());
  };

  return (
    <div>
      <Button
        varaint="contained"
        style={{
          color: "#FFF",
          backgroundColor: "red",
          textTransform: "none",
        }}
        onClick={handleClickOpen}
      >
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action will permanently delete your profile !
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleClose}
            style={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            varaint="contained"
            style={{
              color: "#FFF",
              backgroundColor: "red",
              textTransform: "none",
            }}
            onClick={() => {
              deletePosts();
              deleteProfile(state._id);
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              handleClose();

              history.push("/signin");
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
