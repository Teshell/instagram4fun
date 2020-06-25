import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

import Button from "@material-ui/core/Button";

import { useParams } from "react-router-dom";

import styles from "./Profile.module.css";

const UserProfile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();

  useEffect(() => {
    (async () => {
      const result = await fetch(`/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setProfile(result);
    })();
  }, []);

  const followUser = async () => {
    const data = await fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    dispatch({
      type: "UPDATE",
      payload: { following: data.following, followers: data.followers },
    });

    localStorage.setItem("user", JSON.stringify(data));

    setProfile((prevState) => {
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: [...prevState.user.followers, data._id],
        },
      };
    });
  };

  const unfollowUser = async () => {
    const data = await fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    dispatch({
      type: "UPDATE",
      payload: { following: data.following, followers: data.followers },
    });

    localStorage.setItem("user", JSON.stringify(data));

    setProfile((prevState) => {
      const newFollower = prevState.user.followers.filter(
        (item) => item !== data._id
      );

      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: newFollower,
        },
      };
    });
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "640px", margin: "0.5rem auto" }}>
          <div className={styles.infoContainer}>
            <div>
              <img
                className={styles.avatar}
                src={userProfile.user.profilePic}
                alt={userProfile.user.name}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h4 style={{ marginRight: "0.2rem" }}>
                  {userProfile.user.name}
                </h4>

                {userProfile.user.followers.includes(state._id) ? (
                  <Button
                    variant="contained"
                    onClick={() => unfollowUser()}
                    className={styles.followButton}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => followUser()}
                    className={styles.followButton}
                  >
                    Follow
                  </Button>
                )}
              </div>

              <div className={styles.info}>
                <h6>
                  <strong style={{ fontWeight: "500" }}>
                    {userProfile.posts.length}
                  </strong>{" "}
                  posts
                </h6>
                <h6>
                  <strong style={{ fontWeight: "500" }}>
                    {userProfile.user.followers.length}
                  </strong>{" "}
                  followers
                </h6>
                <h6>
                  <strong style={{ fontWeight: "500" }}>
                    {userProfile.user.following.length}
                  </strong>{" "}
                  following
                </h6>
              </div>
            </div>
          </div>

          <div className={styles.border}></div>

          <div className={styles.gallery}>
            {userProfile.posts
              ? userProfile.posts.map((item) => {
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
      ) : (
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      )}
    </>
  );
};

export default UserProfile;
