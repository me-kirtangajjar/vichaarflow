const jwt = require("jsonwebtoken");

const createAuthToken = (user) => {
  const token = jwt.sign(
    {
      uid: user._id,
      firstName: user.firstName,
      profileImage: user.profileImage,
      role: user.role,
    },
    process.env.tokenSecret,
    { expiresIn: "30d" }
  );
  return token;
};

const validateAuthToken = (token) => {
  const validatedToken = jwt.verify(
    token,
    process.env.tokenSecret,
    (error, data) => {
      if (error) {
        return null;
      }

      return data;
    }
  );

  return validatedToken;
};

module.exports = { createAuthToken, validateAuthToken };
