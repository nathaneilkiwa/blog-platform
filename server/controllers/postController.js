const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL POSTS
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE POST
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      text: req.body.text,
      user: req.user._id,
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user details for the new comment
    await post.populate("comments.user", "name");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMMENT
exports.updateComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    comment.text = req.body.text;
    await post.save();

    // Populate user details
    await post.populate("comments.user", "name");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment
    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Remove the comment using pull
    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json({ message: "Comment deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE LIKE (like/unlike post)
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Like: add user ID to likes array
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ 
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
      post 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT - FIXED
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      text: req.body.text,
      user: req.user._id, // Make sure this is the correct user ID
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user details for all comments
    await post.populate("comments.user", "name email");
    await post.populate("author", "name email");

    res.status(201).json(post);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE LIKE - FIXED
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Convert IDs to strings for comparison
    const userId = req.user._id.toString();
    const likesArray = post.likes.map(id => id.toString());
    
    const alreadyLiked = likesArray.includes(userId);

    if (alreadyLiked) {
      // Unlike: remove user ID from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Like: add user ID to likes array
      post.likes.push(req.user._id);
    }

    await post.save();
    
    // Populate author info before sending response
    await post.populate("author", "name email");

    res.json({ 
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
      post 
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL POSTS - Make sure comments are populated
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: error.message });
  }
};
// EDIT COMMENT
exports.editComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Only comment owner can edit
  if (comment.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  comment.text = req.body.text || comment.text;

  await post.save();
  res.json({ message: "Comment updated" });
};

// DELETE COMMENT
exports.deleteComment = async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Only comment owner can delete
  if (comment.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  comment.deleteOne();
  await post.save();

  res.json({ message: "Comment deleted" });
};