const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allPosts", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/followingposts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { body, pic } = req.body;

  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields !" });
  }

  req.user.password = undefined;

  const post = new Post({
    body,
    photo: pic,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .then((myPost) => {
      res.json({ myPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deleteposts", requireLogin, (req, res) => {
  Post.deleteMany({ postedBy: req.user._id }, function (err, result) {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json({ result });
    }
  });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.put("/comment", requireLogin, (req, res) => {
  if (!req.body.text) {
    return res.status(422).json({ error: "Please add a comment" });
  }

  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) return res.status(422).json({ error: err });

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      }
    });
});

router.put("/editpost/:postId", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: { body: req.body.text },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) return res.status(422).json({ error: "Cannot update name" });

      res.json(result);
    }
  );
});

router.put("/deletecomment", requireLogin, (req, res) => {
  const comment = {
    _id: req.body.commentId,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

module.exports = router;
