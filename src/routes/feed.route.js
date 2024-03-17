const express = require("express");
const { Router } = express;
const { getAllFeeds } = require("../controllers/feed.controller");
const { checkAuthenticated } = require("../middlewares/auth.middleware");

const feedRouter = Router({ mergeParams: true });

feedRouter.get("/", checkAuthenticated, getAllFeeds);

exports.FeedRouter = feedRouter;
