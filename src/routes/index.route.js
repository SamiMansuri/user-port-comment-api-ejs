const { Router } = require("express");
const { UserRouter } = require("./user.route");
const { PostRouter } = require("./post.route");
const { FeedRouter } = require("./feed.route");
const { CommentRouter } = require("./comments.route");

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.redirect("users/login"));
indexRouter.use("/users", UserRouter);
indexRouter.use("/users/:userId/posts", PostRouter);
indexRouter.use("/feed", FeedRouter);
indexRouter.use("/users/:userId/posts/:postId/comments", CommentRouter);

exports.IndexRouter = indexRouter;
