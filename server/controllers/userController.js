import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    // console.log(req);
    const userId = req.user.id; //Get from middleware

    console.log("User ID from middleware:", userId);
    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found in middleware",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    //console.log(user);
    return res.json({
      success: true,
      message: "User Data found",
      userData: {
        name: user.name,
        email: user.email,
        // password: user.password,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error fetching user data(Server): ${error.message}`,
    });
  }
};
