import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);   // 👈 add this
    console.log("Token received:", req.cookies?.token);

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token received",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);  // 👈 add
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default userAuth;
