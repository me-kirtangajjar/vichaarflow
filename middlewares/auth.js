const { validateAuthToken } = require("../services/auth");

const checkAuth = () => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies.uid;

    if (!tokenCookieValue) return next();

    req.user = validateAuthToken(tokenCookieValue);

    next();
  };
};

module.exports = { checkAuth };
