const { commentModel } = require("../models/comments.model");
const { postModel } = require("../models/posts.model");
const { userModel } = require("../models/users.model");
const createError = require("http-errors");

const addComment = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const payload = req.body;
    const { _id: loggedUserId } = req.user;
    const user = await userModel.findById(userId);
    const post = await postModel.findOne({ _id: postId, userId: userId });
    if (!user) throw createError(404, "User does not exist");
    if (!post) throw createError(404, "Post does not exist");
    await commentModel.create({
      commentOn: postId,
      commentBy: loggedUserId,
      ...payload,
    });
    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { userId, postId, commentId } = req.params;
    await commentModel.findByIdAndUpdate(commentId, {
      isDeleted: true,
      deletedAt: Date.now(),
    });
    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  deleteComment,
};
