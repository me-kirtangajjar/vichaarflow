const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkAuth } = require("./middlewares/auth");
require("dotenv").config();
const app = express();
const Blog = require("./models/blog");

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth());

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find().sort({ createdAt: -1 });
  return res.render("home", { user: req.user, blogs: allBlogs });
});
app.use("/users", require("./routes/user"));
app.use("/blogs", require("./routes/blog"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
