const path = require("node:path");
const router = require("express").Router();
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/create-blog", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/create-blog", upload.single("coverImage"), async (req, res) => {
  const { title, description } = req.body;
  await Blog.create({
    title,
    description,
    createdBy: req.user.uid,
    coverImage: `/uploads/${req.file.filename}`,
  });

  return res.redirect("/");
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", { user: req.user, blog, blogComments: comments });
});

router.post("/:blogId/comment", async (req, res) => {
  const { comment } = req.body;

  await Comment.create({
    comment,
    blogId: req.params.blogId,
    createdBy: req.user.uid,
  });

  return res.redirect(`/blogs/${req.params.blogId}`);
});

module.exports = router;
