import React, { useContext } from "react";

import { AppBar, Toolbar, Button, Avatar } from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { UserContext } from "../../App";

import styles from "./NavBar.module.css";

export const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();

  const renderList = () => {
    if (state) {
      return [
        <div
          className={styles.navLinks}
          key={"navlinks"}
          style={{ width: "350px" }}
        >
          <Link
            to="/createpost"
            title="Create a post"
            key={"createpost"}
            className={styles.link}
          >
            <AddIcon style={{ marginTop: "0.3rem" }}></AddIcon>
          </Link>

          <Button
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
            title="Logout"
            key={"logout"}
          >
            <ExitToAppIcon></ExitToAppIcon>
          </Button>

          <Link
            to="/profile"
            title="Your profile"
            key={"profilepic"}
            className={styles.link}
          >
            <Avatar
              style={{ width: "30px", height: "30px" }}
              alt={state.name}
              src={state.profilePic}
            />
          </Link>
        </div>,
      ];
    } else {
      return [
        <div
          className={styles.authLinks}
          key={"authlinks"}
          style={{ width: "200px" }}
        >
          <Link to="/signin" className={styles.link}>
            Sign-in
          </Link>

          <Link to="/signup" className={styles.link}>
            Sign-up
          </Link>
        </div>,
      ];
    }
  };

  return (
    <div>
      <AppBar position="static" variant="outlined" className={styles.appBar}>
        <Toolbar className={styles.toolBar} xs={12} md={3}>
          <Link to={state ? "/" : "/signin"} style={{ textDecoration: "none" }}>
            <p className={styles.logo}>Instagram</p>
          </Link>
          {renderList()}
        </Toolbar>
      </AppBar>
    </div>
  );
};
