import React, { useState } from "react";

import { Link } from "react-router-dom";

import { TextField, Avatar, Button, IconButton } from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import DeleteComment from "./DeleteComment";

import styles from "./Post.module.css";

const AddComment = ({ item, user, deleteComment, addComment }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  return (
    <div>
      {item.comments.map((comment) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            key={comment._id}
          >
            <div>
              <h6 style={{ marginLeft: "0.2rem" }}>
                <span style={{ fontWeight: "bold" }}>
                  <Link
                    to={
                      item.postedBy._id !== user._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      alignItems: "center",
                    }}
                  >
                    {comment.postedBy.name}
                  </Link>
                </span>
                {" " + comment.text}
              </h6>
            </div>
            {comment.postedBy._id === user._id && (
              <DeleteComment
                deleteComment={deleteComment}
                commentId={comment._id}
                postId={item._id}
              />
            )}
          </div>
        );
      })}
      <div className={styles.border}></div>
      <form
        className={styles.formComment}
        onSubmit={(e) => {
          e.preventDefault();
          addComment(e.target[0].value, item._id);
          setInput("");
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "97%",
          }}
        >
          <input
            id="outlined-basic"
            style={{
              width: "75%",
              margin: "0 0.5rem 0 0",
              border: "none",
              outline: "none",
            }}
            placeholder="Write a comment..."
            value={input}
            onChange={handleInputChange}
          />

          {input === "" ? (
            <Button
              variant="contained"
              title="Add comment"
              disabled={true}
              style={{ height: "35px", textTransform: "none" }}
            >
              <SendIcon style={{ color: "#565769" }}></SendIcon>
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              title="Add comment"
              style={{ height: "35px", textTransform: "none" }}
            >
              <SendIcon style={{ color: "#565769" }}></SendIcon>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddComment;
