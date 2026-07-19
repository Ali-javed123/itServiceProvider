import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../modules/User.js";
import { TryCatch } from "../../config/TryCatch.js";
import { generateOTP, storeOTP, verifyOTP } from "../../services/otpService.js";
import { publishEmail } from "../../services/emailPublisher.js";
import { emailTemplate } from "../../services/emailTemplate.js";
import { RedisService } from "../../config/redis.js";
import { uploadImage, deleteImage, } from "../../config/imageUploader.js";
export const Login = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required.",
        });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password.toString(), user.password.toString());
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    // Generate OTP & save in Redis
    const otp = generateOTP();
    await storeOTP(user.email, otp);
    // Temporary token (verification ke waqt use hoga agar chaho)
    const verificationId = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    // Publish to RabbitMQ -> worker email bhejega
    await publishEmail({
        to: user.email,
        subject: "Login OTP Verification",
        html: emailTemplate(otp),
    });
    return res.status(200).json({
        success: true,
        message: "OTP sent successfully.",
        verificationId,
    });
});
export const VerifyLoginOtp = TryCatch(async (req, res) => {
    const { email, otp } = req.body;
    // Validation
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required!.",
        });
    }
    // Redis me email ke basis par OTP verify karega
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP.",
        });
    }
    // User check
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }
    // Login Token
    const token = jwt.sign({
        id: user._id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return res.status(200).json({
        success: true,
        message: "OTP verified successfully. Login successful.",
        token,
        user,
    });
});
export const profileGet = TryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required.",
        });
    }
    const user = await UserModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }
    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully.",
        user,
    });
});
export const profileUpdate = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { email, name, age, fullName, gender, } = req.body;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required.",
        });
    }
    // Token user sirf apni profile update kar sakta hai
    if (req.user?.id !== id) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to update this profile.",
        });
    }
    const user = await UserModel.findById(id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }
    // Email duplicate check
    if (email && email !== user.email) {
        const alreadyExist = await UserModel.findOne({ email });
        if (alreadyExist) {
            return res.status(409).json({
                success: false,
                message: "Email already exists.",
            });
        }
        user.email = email;
    }
    // Image update
    let image = user.image;
    if (req.file) {
        // Delete old image
        if (user.image?.public_id) {
            await deleteImage(user.image.public_id);
        }
        // Upload new image
        image = await uploadImage(req.file);
    }
    // Update remaining fields
    user.name = name ?? user.name;
    user.age = age ?? user.age;
    user.fullName = fullName ?? user.fullName;
    user.gender = gender ?? user.gender;
    user.image = image;
    await user.save();
    // Password hide
    const responseUser = user.toObject();
    // remove password before sending response
    delete responseUser.password;
    return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: responseUser,
    });
});
//# sourceMappingURL=login.js.map