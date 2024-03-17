const { postModel } = require("../models/posts.model");
const { commentModel } = require("../models/comments.model");
const createError = require("http-errors");

const addPost = async (req, res, next) => {
  try {
    res.render("createPost", { user: req.user });
  } catch (error) {
    next(error);
  }
};

const addPostProcess = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;
    const { _id: tokenUserId } = req.user;
    if (userId != tokenUserId.toString())
      throw createError(401, "Unauthorized");
    await postModel.create({ userId, title, description });
    res.redirect("/feed");
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const post = await postModel
      .findOne({ _id: postId, userId, isDeleted: false })
      .lean();
    if (!post) throw createError(404, "Post does not exist");
    return res.render("updatePost", { user: req.user, post, userId, postId });
  } catch (error) {
    next(error);
  }
};

const updatePostProcess = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const payload = req.body;
    const { _id: tokenUserId } = req.user;
    if (userId !== tokenUserId.toString())
      throw createError(403, "Unauthorized");
    const post = await postModel.findById(postId);
    if (!post || post.userId.toString() !== userId)
      throw createError(404, "Post does not exist");
    await postModel.findOneAndUpdate(
      { _id: postId, isDeleted: false },
      payload,
      {
        new: true,
      }
    );
    return res.redirect("/feed");
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;
    const { _id: loggedUserId, role } = req.user;

    if (userId !== loggedUserId.toString() && role !== "admin")
      throw createError(403, "Unauthorized");

    const post = await postModel.findById(postId).lean();
    if (!post || post.userId != userId) {
      throw createError(404, "Post does not exist");
    }

    await Promise.all([
      commentModel.updateMany(
        {
          commentOn: postId,
        },
        { isDeleted: true, deletedAt: Date.now() }
      ),
      postModel.findByIdAndUpdate(postId, {
        isDeleted: true,
        deletedAt: Date.now(),
      }),
    ]);
    return res.redirect("/feed");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPost,
  addPostProcess,
  updatePostProcess,
  updatePost,
  deletePost,
};
