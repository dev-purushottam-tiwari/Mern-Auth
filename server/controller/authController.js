import bcrypt from "bcryptjs";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "missing details",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "user already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to our app",
      text: `Hi ${user.name},\n\nWelcome to our app! We're glad to have you on board.\n\nBest regards,\nThe Quick Chat`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "user registered successfully",
      token,
    });
  } catch (error) {
    console.error("Email Error:", error); // This will tell you the EXACT reason
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "invalid password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "user logged in successfully",
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    

    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }

    const otp = String(100000 + Math.floor(Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
     
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",email)


    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const userId = req.userId.email;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "invalid otp or user id",
    });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (
      !user.verifyOtp ||
      user.verifyOtp.toString() !== otp.toString().trim()
    ) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpiryAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isAccountVerified = true;

    user.verifyOtp = '';
    user.verifyOtpExpiryAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false, 
      message: error.message,
      
    });
  }
};


export const isAuthenticated =async(req,res)=>{
     try {
      return res.json({
        success: true,
        message: "User is authenticated",
      });
      
     } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
      
     }

}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(100000 + Math.floor(Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp),
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Reset OTP sent to your email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async(req,res)=>{
  const {email,otp,newPassword} = req.body;

  if(!email || !otp ||!newPassword){
    return res.json({
      success:false,
      message:"All fields are required"
    })
  }

  try{
    
    const user = await userModel.findOne({email})
    if(!user){
      return res.json({
        success:false,
        message:"User not found"
      })
    }

      if(user.resetOtp === '' || user.resetOtp !== otp.toString().trim()){
        return res.json({
          success:false,
          message:'invalid OTP'
        })
      }
      if(user.resetOtpExpireAt < Date.now()){
        return res.json({
          success:false,
          message:"OTP expired"
        })
      }

      const hashedPassword = await bcrypt.hash(newPassword,10)

      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpireAt = 0;

      await user.save();

      return res.json({
        success:true,
        message:"Password reset successfully"
      })
    }
  
  catch(error){
    res.json({
      success:false,
      message:error.message
    })
  }
}

  