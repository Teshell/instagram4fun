import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

import Button from "@material-ui/core/Button";

import EditInfo from "./EditInfo";

import CircularIndeterminate from "../common/CircularProgress";

import styles from "./Profile.module.css";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    (async () => {
      const data = await fetch("/mypost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setMyPosts(data.myPost);
    })();
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();

      data.append("file", image);
      data.append("upload_preset", "instagram-clone");
      data.append("cloud_name", "dx4govbm1");

      setLoading(true);

      (async () => {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dx4govbm1/image/upload",
          {
            method: "post",
            body: data,
          }
        ).then((res) => res.json());

        const result = await fetch("/updatepic", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            profilePic: response.url,
          }),
        }).then((res) => res.json());

        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, profilePic: result.profilePic })
        );

        dispatch({
          type: "UPDATEPIC",
          payload: result.profilePic,
        });

        setLoading(false);
      })();
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0.5rem auto" }}>
      <div className={styles.infoContainer}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading === false ? (
            <img
              className={styles.avatar}
              src={state.profilePic}
              alt="Avatar"
            />
          ) : (
            <div
              className={styles.avatar}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularIndeterminate />
            </div>
          )}

          <Button
            variant="outlined"
            component="label"
            style={{ textTransform: "none" }}
          >
            Update picture
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
              style={{ display: "none" }}
            />
          </Button>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <h4>{state ? state.name : "loading..."}</h4>
            <EditInfo />
          </div>

          <div className={styles.info}>
            <h6>
              <strong style={{ fontWeight: "500" }}>{myPosts.length}</strong>{" "}
              posts
            </h6>
            <h6>
              <strong style={{ fontWeight: "500" }}>
                {state !== null && state.followers !== undefined
                  ? state.followers.length
                  : "0"}
              </strong>{" "}
              followers
            </h6>
            <h6>
              <strong style={{ fontWeight: "500" }}>
                {state !== null && state.following !== undefined
                  ? state.following.length
                  : "0"}
              </strong>{" "}
              following
            </h6>
          </div>
        </div>
      </div>

      <div className={styles.border}></div>

      <div className={styles.gallery}>
        {myPosts
          ? myPosts.map((item) => {
              return (
                <img
                  key={item._id}
                  className={styles.item}
                  src={item.photo}
                  alt="post"
                />
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default Profile;
