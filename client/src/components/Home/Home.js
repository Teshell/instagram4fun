import React from "react";

import { ToastContainer } from "react-toastify";

import Posts from "../NewsFeed/Posts";
import FollowingPosts from "../NewsFeed/FollowingPosts";

export default function Home() {
  return (
    <div>
      <FollowingPosts />
      <Posts />
      <ToastContainer />
    </div>
  );
}
