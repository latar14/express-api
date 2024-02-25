const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  UserController,
  PostController,
  CommentController,
  LikeController,
  FollowController
} = require("../controllers");
const authenticateToken = require("../middlewares/auth");

const uploadDestination = "uploads";

//Храним файлы тут
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cd(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

//Роуты пользователя
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.currentUser);
router.get("/users/:id", authenticateToken, UserController.login);
router.put("/users/:id", authenticateToken, UserController.updateUser);

//Роуты постов

router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// Роуты коменнатариев

router.get("/comments", authenticateToken, CommentController.createComment);
router.delete("/comments/:id", authenticateToken, CommentController.deleteComment);

// Роуты лайков

 router.post("/likes", authenticateToken, LikeController.likePost);
 router.delete("/likes/:id", authenticateToken, LikeController.unlikePost);

//Роуты подписок

 router.post("/follow", authenticateToken, FollowController.followUser);
 router.delete("/follow/:id", authenticateToken, FollowController.unfollowUser);

module.exports = router;
