const { createHmac } = require("node:crypto");
const router = require("express").Router();
const User = require("../models/user");
const { createAuthToken } = require("../services/auth");

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashedPassword = createHmac("sha256", process.env.saltSecret)
    .update(password)
    .digest("hex");

  await User.create({ firstName, lastName, email, password: hashedPassword });
  return res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.render("login", { error: "Account not exist, Register first" });
  }

  const hashedPassword = createHmac("sha256", process.env.saltSecret)
    .update(password)
    .digest("hex");

  if (user.password != hashedPassword) {
    return res.render("login", { error: "Incorrect email or password" });
  }

  const token = createAuthToken(user);
  res.cookie("uid", token, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("uid");
  return res.redirect("/");
});

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user.uid);
  return res.render("userProfile", { user });
});

module.exports = router;
