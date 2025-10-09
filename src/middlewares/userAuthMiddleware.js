import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuthMiddleware = async (req, res, next) => {
  try {
    // Support both custom 'token' header and standard 'Authorization: Bearer <token>'
    let token = req.headers.token || req.headers.authorization || req.headers.Authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized login again" });
    }

    // If header is 'Bearer <token>' extract the token portion
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userData = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized login again" });
  }
};

export default userAuthMiddleware;
