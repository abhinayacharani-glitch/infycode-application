import jwt from "jsonwebtoken";

// VERIFY TOKEN
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN CHECK
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// STUDENT CHECK
export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access only" });
  }
  next();
};

// TRAINER CHECK
export const isTrainer = (req, res, next) => {
  if (req.user.role !== "trainer") {
    return res.status(403).json({ message: "Trainer access only" });
  }
  next();
};
// const jwt = require("jsonwebtoken");

// exports.verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token)
//     return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };