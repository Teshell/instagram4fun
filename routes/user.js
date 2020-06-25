const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) return res.status(422).json({ error: err });
          res.json({ user, posts });
        });
    })
    .catch((err) => res.status(404).json({ error: "User not found!" }));
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { profilePic: req.body.profilePic },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) return res.status(422).json({ error: "Cannot update pic" });

      res.json(result);
    }
  );
});

router.put("/updateinfo", requireLogin, (req, res) => {
  if (!req.body.name) {
    return res.status(422).json({ msg: "Please add all the fields" });
  }

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { name: req.body.name },
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

router.delete("/deleteprofile/:userId", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userId }).exec((err, user) => {
    if (err || !user) return res.status(422).json({ error: err });

    if (user._id.toString() === req.user._id.toString()) {
      user
        .remove()
        .then((result) => res.json(result))
        .catch((err) => console.log(err));
    }
  });
});

module.exports = router;
