const { postModel } = require("../models/posts.model");
const { commentModel } = require("../models/comments.model");

exports.getAllFeeds = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const recordsToSkip = page > 0 ? limit * (page - 1) : 0;
  const data = await Promise.all([
    postModel
      .find({ isDeleted: false }, { isDeleted: 0, deletedAt: 0 })
      .skip(recordsToSkip)
      .limit(limit)
      .lean()
      .populate("userId"),
    commentModel
      .find({ isDeleted: false }, { isDeleted: 0, deletedAt: 0 })
      .populate("commentBy"),
  ]);
  const noOfDocs = await postModel.countDocuments();
  const pages = Math.ceil(noOfDocs / limit);

  res.render("feed", {
    posts: data[0],
    comments: data[1],
    user: req.user,
    pages,
  });
};
