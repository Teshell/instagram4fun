import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useTheme } from "@material-ui/core/styles";

import { UserContext } from "../../App";

import DeleteProfile from "./DeleteProfile";

import EditIcon from "@material-ui/icons/Edit";

export default function EditInfo() {
  const { state, dispatch } = useContext(UserContext);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(state.name);

  const updateInfos = async () => {
    const result = await fetch("/updateinfo", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
      }),
    }).then((res) => res.json());

    localStorage.setItem(
      "user",
      JSON.stringify({ ...state, name: result.name })
    );

    dispatch({
      type: "UPDATE_INFO",
      payload: result.name,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <EditIcon
        style={{ margin: "1.8rem 0 0 1.3rem", cursor: "pointer" }}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit info</DialogTitle>
        <DialogContent style={{ width: "350px", height: "100px" }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Edit name"
            value={name}
            onChange={handleNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <DeleteProfile />
          </div>

          <div>
            <Button
              color="primary"
              onClick={handleClose}
              style={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            {name.length > 2 && name !== state.name ? (
              <Button
                variant="contained"
                onClick={() => {
                  updateInfos();
                  handleClose();
                }}
                color="primary"
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
