import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Avatar,
  IconButton,
} from "@material-ui/core";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import { UserContext } from "../../App";
import AddComment from "./AddComment";
import CircularIndeterminate from "../common/CircularProgress";

import { ToastContainer } from "react-toastify";

import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

import styles from "./Post.module.css";

const Posts = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const data = await fetch("/allPosts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }).then((res) => res.json());

      setLoading(false);
      setData(data.posts);
    })();
  }, []);

  const likePost = async (id) => {
    const result = await fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const newData = data.map((item) => {
      if (item._id === result._id) return result;
      else return item;
    });

    setData(newData);
  };

  const unlikePost = async (id) => {
    const result = await fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const newData = data.map((item) => {
      if (item._id === result._id) return result;
      else return item;
    });

    setData(newData);
  };

  const addComment = async (text, postId) => {
    const result = await fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const newData = data.map((item) => {
      if (item._id === result._id) return result;
      else return item;
    });

    setData(newData);
  };

  const deletePost = async (postId) => {
    const result = await fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((res) => res.json());

    const newData = data.filter((item) => {
      return item._id !== result._id;
    });

    setData(newData);
  };

  const deleteComment = async (commentId, postId) => {
    const result = await fetch("/deletecomment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        commentId,
        postId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const newData = data.map((item) => {
      if (item._id === result._id) return result;
      else return item;
    });

    setData(newData);
  };

  return (
    <div style={{ margin: "0" }}>
      {loading === false ? (
        data.map((item) => {
          return (
            <React.Fragment key={item._id}>
              {state === null ||
              state.following === undefined ||
              state.following.includes(item.postedBy._id) ? (
                ""
              ) : (
                <Card variant="outlined" className={styles.cardContainer}>
                  <CardContent style={{ padding: "0 0 10px 0" }}>
                    <div className={styles.cardHeader}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        style={{ margin: "0.5rem 0.5rem" }}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "#000",
                            display: "flex",
                            alignItems: "center",
                          }}
                          to={
                            item.postedBy._id !== state._id
                              ? "/profile/" + item.postedBy._id
                              : "/profile"
                          }
                        >
                          <Avatar
                            alt={item.postedBy.name}
                            src={item.postedBy.profilePic}
                          />
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              fontSize: "0.6em",
                            }}
                          >
                            {item.postedBy.name}
                          </span>
                        </Link>
                      </Typography>
                      {item.postedBy._id === state._id && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <EditPost post={item} />
                          <DeletePost
                            deletePost={deletePost}
                            itemId={item._id}
                          />
                        </div>
                      )}
                    </div>

                    <CardMedia
                      style={{ height: "0", paddingTop: "125.25%" }}
                      image={item.photo}
                    />
                    {item.likes.includes(state._id) ? (
                      <IconButton
                        onClick={() => {
                          unlikePost(item._id);
                        }}
                      >
                        <FavoriteIcon style={{ fontSize: "35px" }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => {
                          likePost(item._id);
                        }}
                      >
                        <FavoriteBorderIcon style={{ fontSize: "35px" }} />
                      </IconButton>
                    )}

                    <strong>{item.likes.length} </strong>
                    <span>likes</span>

                    <Typography
                      style={{
                        fontSize: "1em",
                        fontWeight: "bold",
                        margin: "0 0.5rem 0.5rem 0.5rem",
                      }}
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "#000",
                          alignItems: "center",
                        }}
                        to={
                          item.postedBy._id !== state._id
                            ? "/profile/" + item.postedBy._id
                            : "/profile"
                        }
                      >
                        {item.postedBy.name}
                      </Link>{" "}
                      <span style={{ fontWeight: "100" }}>{item.body}</span>
                    </Typography>
                    <div className={styles.border}></div>
                    <h6 style={{ margin: "0 0 0 0.5rem", opacity: "0.7" }}>
                      {item.comments.length} comments:
                    </h6>

                    <AddComment
                      item={item}
                      user={state}
                      deleteComment={deleteComment}
                      addComment={addComment}
                    />
                  </CardContent>
                  <ToastContainer />
                </Card>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <CircularIndeterminate />
        </div>
      )}
    </div>
  );
};

export default Posts;
