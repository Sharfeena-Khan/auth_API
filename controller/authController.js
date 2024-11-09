const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator"); // For validating email and phone

const randomstring = require("randomstring");
const otpGenerator = () => {
  return randomstring.generate({
    length: 4,
    charset: "numeric",
  });
};

const User = require("../model/userSchema");
const OTP = require("../model/otpSchema");

exports.signUp = async (req, res) => {
  try {
    let { contactInfo, password } = req.body; // Use 'let' instead of 'const'

    console.log("Contact Info Received:", contactInfo);

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validPhone = /^[0-9]{10}$/;

    let userInfo = null; // Change to let instead of const
    
    // Ensure contactInfo is a string and remove leading/trailing spaces
    contactInfo = String(contactInfo).trim();

    if (validEmail.test(contactInfo)) {
      userInfo = { email: contactInfo };
    } else if (validPhone.test(contactInfo)) {
      userInfo = { phone: contactInfo };
    } else {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    console.log("Phone or Email Being Checked:", userInfo);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for an existing user based on phone or email
    const existingUser = await User.findOne({
      userInfo
      // $or: [{ email: userInfo.email }, { phone: userInfo.phone }],
    });

    console.log("Existing User Found:", existingUser);

    // If there's an existing user, return an error message
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = otpGenerator();
    const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 1); // Set expiration time to 5 minutes from now

    const newOtp = new OTP({
      ...userInfo,
      password: hashedPassword,
      otp,
      expiresAt
    });

    const dbData = await newOtp.save();
    console.log("OTP Data Saved:", dbData);

    console.log("Your OTP is", otp);

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {

    
    
    let { userId, otp } = req.query;
    console.log('*********', req.query);

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validPhone = /^[0-9]{10}$/;

    userId = String(userId).trim();

    let userInfo =null
    console.log("----------   userId    --------------" , userInfo);
    userId = String(userId).trim();

    if (validEmail.test(userId)) {
      userInfo = { email: userId }; // If it's an email
      console.log("----------   email    --------------" , userInfo);
      
    } else if (validPhone.test(userId)) {
      userInfo = { phone: userId }; // If it's a phone number
      console.log("----------   phone    --------------" , userInfo);
    } else {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }
    
    // Log to verify userInfo structure
    console.log("User Info:", userInfo);
    
    const validOTP = await OTP.findOne({
      $or: [
        { email: userInfo.email },  // Matches email if available
        { phone: userInfo.phone }   // Matches phone if available
      ],
      otp: otp, // Matches the OTP provided
    });
    
   

    console.log("/*/*/*/*/*/*/*/*/**/*/", validOTP);
    
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }
     const savedPassword = validOTP.password

    const newUser = new User({
      ...userInfo, // Add either email or phone based on the input
      password: savedPassword,
    });
    
    await newUser.save();

    // await OTP.deleteOne({userInfo})

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {}
};

exports.resend_OTP = async (req, res) => {
  try {
    const { userId } = req.query;

    const userInfo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userId)
                    ? {email : userId}
                    : /^[0-9]{10}$/.test(userId)
                    ?{phone : userId}
                    :null

     const otp = otpGenerator();

    const updatedOtp = await OTP.findOneAndUpdate(
      userInfo,
      {otp : otp },
      {upsert : true, new: true}
    )

   
   

    console.log("Your OTP is ", otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {}
};
