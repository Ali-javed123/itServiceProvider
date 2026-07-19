import type { Request, Response } from "express";

import { UserModel } from "../../modules/User.js";
import { TryCatch } from "../../config/TryCatch.js";

import {
  uploadImage,
  deleteImage,
} from "../../config/imageUploader.js";
import type { AuthenticationRequest } from "../../middleware/isAuth.js";





export const profileUpdate = TryCatch(
  async (req: AuthenticationRequest, res: Response) => {
    const { id } = req.params;

    const {
      email,
      name,
      age,
      fullName,
      gender,
    } = req.body;

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
    delete (responseUser as any).password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: responseUser,
    });
  }
);