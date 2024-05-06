const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generateHelper = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);
  const exitsEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (exitsEmail) {
    res.json({ code: 200, masage: "email ddax ton tai" });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateHelper.generateRandomString(30),
    });
    user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({ code: 200, masage: "Tạo tk thành công", token: token });
  }
};
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({ code: 400, masage: "ko co" });
    return;
  }
  if (md5(password) !== user.password) {
    res.json({ code: 400, masage: "Sai mật khẩu " });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({ code: 200, masage: "Đăng nhập thành công", token: token });
};
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({ code: 400, masage: "ko co" });
    return;
  }
  const otp = generateHelper.generateRandomNumber(8);

  const objForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpires * 60 * 1000,
  };
  const forgotPassword = new ForgotPassword(objForgotPassword);
  await forgotPassword.save();
  const subject = "Mã OTP xác minh lấy lại mật khẩu ";
  const html = `Mã OTP để lấy lại mật khẩu là <b style="color:blue"> ${otp}</b> .Thời hạn sử dụng là 3 phút`;
  sendMailHelper.sendMail(email, subject, html);

  res.json({ code: 200, masage: "Lấy mật khẩu thành công" });
};

module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    res.json({ code: 400, masage: "otp không hợp lệ" });
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  const token = user.token;
  res.cookie("token", token);
  res.json({ code: 200, masage: "Succfully" });
};
module.exports.resetPassword = async (req, res) => {
  const token = req.cookies.token;
  const password = req.body.password;
  const user = await User.findOne({
    token: token,
  });
  if (md5(password) === user.password) {
    res.json({ code: 400, masage: "Sai mật khẩu " });
    return;
  }
  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(password),
    }
  );
  res.json({ code: 200, masage: "Succfully" });
};
module.exports.detail = async (req, res) => {
  res.json({ code: 200, masage: "Thành công", info: req.user });
};
module.exports.listUser = async (req, res) => {
  const user = await User.find({ deleted: false }).select("fullName email");
  res.json({ code: 200, masage: "Thành công", user: user });
};
