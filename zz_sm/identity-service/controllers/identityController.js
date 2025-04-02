const logger = require("../utils/logger");
const argon2 = require("argon2");
const { validateRegistration } = require("../utils/validation");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const generateTokens = require("../utils/generateToken");

// user registration
const registerUser = async (req, res) => {
  try {

    let { username, email, password } = req.body;

    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Enter All credentials" });

    const check = await User.findOne({ $or: [{ email }, { username }] });
    if (check)
      return res
        .status(400)
        .json({ success: false, message: "username/email already exists" });
    password = await argon2.hash(password);

    const user = await User.create({ username, email, password });

    const {accessToken,refreshToken} = await generateTokens(user);

    return res.status(201).json({ success: true, message: "user registered!",accessToken:accessToken,refreshToken:refreshToken });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// user login
const loginUser = async (req, res) => {
  try {
    let { username,email, password } = req.body;
    if ( (!username && !email) || !password)
      return res
        .status(400)
        .json({ success: false, message: "Enter all credentials" });
    let user = {}

    if(!username)
    user = await User.findOne({ email: email });
    else
    user = await User.findOne({username:username});

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const check = await argon2.verify(user.password, password);
    if (!check)
      return res
        .status(400)
        .json({ success: false, message: "Enter correct credentials" });
    
    const {accessToken,refreshToken} = await generateTokens(user);
    return res.status(200).json({ success: true, message: "user logged in!", accessToken:accessToken, refreshToken:refreshToken });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success:false, message:"Internal Server Error" });
  }
};

// refresh token
const refreshTokenController = async(req,res)=>{
  try {
    const {refreshToken} = req.body;
    if(!refreshToken)
      return res.status(400).json({success:false,message:"Refresh Token missing"})
    const storedToken = await RefreshToken.findOne({token: refreshToken})

    if(!storedToken || storedToken.expiresAt < new Date()){
      return res.status(401).json({
        success:false,
        message: `Invalid or expired refresh token`
      })
    }

    const user = await User.findById(storedToken.user)
    if(!user)
      return res.status(401).json({success:false,message:'User not found'});

    const {accessToken: newAccessToken, refreshToken: newrefreshToken} = await generateTokens(user);

    //delete the old refresh token
    await RefreshToken.deleteById({_id:storedToken._id})

    return res.json({success:true,accessToken:newAccessToken,refreshToken:newrefreshToken});

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success:false, message:"Internal Server Error" });
  }
}

// logout
const logoutUser = async(req,res)=>{
  try {
    const {refreshToken} = req.body
    if(!refreshToken)
      return res.status(400).json({success:false,message:"Refresh Token missing"})

    await RefreshToken.deleteOne({token: refreshToken});
    res.json({success:true,message:"Logged out user"});

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success:false, message:"Internal Server Error" });
  }
}

module.exports = {loginUser,registerUser,refreshTokenController,logoutUser}