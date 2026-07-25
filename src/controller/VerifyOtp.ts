import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { TryCatch } from "../config/TryCatch.js";
// ✅ FIX 1: Sabhi OTP functions ko ek hi line mein import karein
import { generateOTP, storeOTP, verifyOTP } from "../services/otpService.js";
import { UserModel } from "../modules/User.js";
import { generateToken } from "../middleware/generateToken.js";
import { RedisService } from "../config/redis.js";
import { publishEmail } from "../services/emailPublisher.js";
import { emailTemplate } from "../services/emailTemplate.js";

interface VerifyBody {
  verificationId: string;
  otp: string;
  otp_verificationId:string
}

interface ResendBody {
  verificationId: string;
  otp_verificationId:string
}

export const VerifyOtp = TryCatch(
  async (req: Request<{}, {}, VerifyBody>, res: Response) => {
    const { verificationId, otp } = req.body;

    if (!verificationId || !otp) {
      return res.status(400).json({
        success: false,
        message: "verificationId and otp are required.",
      });
    }

    // Decode the temporary token to get email
    let decoded: any;
    try {
      decoded = jwt.verify(verificationId, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification token.",
      });
    }

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token payload.",
      });
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // OTP is valid – now find the user and issue the final token
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Store login session in Redis
    await RedisService.set(
      `login:${user._id}`,
      {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        token,
        loginAt: new Date().toISOString(),
      },
      60 * 60 * 24 // 1 day
    );

    // Remove password
    const userObj = user.toObject();
    const { password: _, ...safeUser } = userObj;

    return res.status(200).json({
      success: true,
      message: "Login verified successfully.",
      token,
      user: safeUser,
    });
  }
);

export const ResendOtp = TryCatch(
  async (req: Request<{}, {}, ResendBody>, res: Response) => {
    const { verificationId } = req.body;

    // Validation
    if (!verificationId) {
      return res.status(400).json({
        success: false,
        message: "verificationId is required.",
      });
    }

    // Verify JWT
    let decoded: any;

    try {
      decoded = jwt.verify(
        verificationId,
        process.env.JWT_SECRET!
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    const email = decoded.email;

    // Cooldown
    const cooldownKey = `otp_cooldown:${email}`;

    const lastSentTime = await RedisService.get<string>(cooldownKey);

    if (lastSentTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const lastTime = Number(lastSentTime);

      const waitTime = 30;

      if (currentTime - lastTime < waitTime) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${
            waitTime - (currentTime - lastTime)
          } seconds before requesting a new OTP.`,
        });
      }
    }

    // Save cooldown
    await RedisService.set(
      cooldownKey,
      Math.floor(Date.now() / 1000).toString(),
      60
    );

    // Generate new OTP
    const otp = generateOTP();

    await storeOTP(email, otp);

    // Send email
    await publishEmail({
      to: email,
      subject: "Your New Login OTP",
      html: emailTemplate(otp),
    });

    // Generate new verificationId
    const newVerificationId = jwt.sign(
      { email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
      verificationId: newVerificationId,
    });
  }
);