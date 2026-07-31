const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUserExist) {
      return res
        .status(400)
        .json({ error: "Username or Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ username, email, password: hash });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function loginUserController(req, res) {
  const { email, username, password } = req.body;
  const loginIdentifier = email || username;

  const user = await userModel.findOne({
    $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
  });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email/username or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
}

async function logoutUserController(req, res) {

  const token=req.cookies.token;
  if(token){
    await blacklistModel.create({token});
  }
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: 'none' });
  res.status(200).json({ message: "User logged out successfully" });
}

async function getMeController(req, res) {
    const userID=req.user.id;
    const user=await userModel.findById(userID);
    
    return res.status(200).json({
        id:user._id,
        username:user.username,
        email:user.email
    });
}


module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController
};