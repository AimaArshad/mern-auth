// add function to find the  token from the cookie, .....from that token-->we will get user ID

import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  console.log("All cookies:", req.cookies); // Check all cookies
  console.log("Token cookie:", req.cookies.token); // Specific token cookie
  const { token } = req.cookies;
  //const token=req.cookies.token;
  console.log("Token from cookies:", token);
  if (!token) {
    return res.json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded_token);
    console.log("Decoded token.id:", decoded_token.id);
    if (decoded_token.id) {
      req.user = { id: decoded_token.id };
      // req.body.id = decoded_token.id;
      console.log("User ID set in req.user:  (req.user.id)", req.user.id);
      console.log(req, "in middleware--passing control to controller");
      next();
    } else {
      console.log("Token decoded but no ID found:", decoded_token);
      return res.json({
        success: false,
        message:
          "Not authorized. Login Again ..Invalid token structure - No ID found",
      });
    }

    console.log("Decoded token:", decoded_token);
  } catch (error) {
    return res.json({
      success: false,
      message: `Invalid token ${error.message}`,
    });
  }
};

export default userAuth;

/*


export const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Safer property access
    const userId = decoded?.id || decoded?._id || decoded?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }
    
    req.user = { id: userId };
    next();
    
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: `Authentication failed: ${error.message}`,
    });
  }
};*/
