import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";
export const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "users",
        }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error("Upload Failed"));
            resolve({
                url: result.secure_url,
                public_id: result.public_id,
            });
        });
        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);
    });
};
//# sourceMappingURL=imageUploader.js.map