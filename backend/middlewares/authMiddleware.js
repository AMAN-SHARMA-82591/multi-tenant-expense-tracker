import jwt from "jsonwebtoken";
import UserModel from "../model/User.model.js";

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(404)
      .json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decode.id).lean().select("_id");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }
    req.user = decode;
    req.uid = decode.id;
    req.tid = decode.tenantId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authenticationMiddleware;
