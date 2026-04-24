/**
 * generateToken.js
 *
 * Creates a signed JWT containing the user's role, username, and email.
 * Token expires in 1 day.
 */

import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id:       user.id || user._id,
      email:    user.email,
      username: user.username || user.fullname || user.fullName,
      role:     user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;