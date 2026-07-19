import bcrypt from "bcrypt";
import { UserModel } from "../../modules/User.js";
import { uploadImage } from "../../config/imageUploader.js";
import { TryCatch } from "../../config/TryCatch.js";
import { generateToken } from "../../middleware/generateToken.js";
export const Register = TryCatch(async (req, res) => {
    const { email, password, name, age, fullName, gender, } = req.body;
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image Required",
        });
    }
    const alreadyExist = await UserModel.findOne({
        email,
    });
    if (alreadyExist) {
        return res.status(409).json({
            success: false,
            message: "Email Already Exists!",
        });
    }
    const image = await uploadImage(req.file);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        email,
        password: hashPassword,
        name,
        age,
        fullName,
        gender,
        image,
    });
    const token = generateToken(user);
    res.status(201).json({
        success: true,
        message: "Register Success",
        token,
        user
    });
});
//# sourceMappingURL=register.js.map