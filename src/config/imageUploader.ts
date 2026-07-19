import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

interface UploadResponse {

    url: string;

    public_id: string;

}
export const uploadImage = async (

    file: Express.Multer.File

): Promise<UploadResponse> => {

    return new Promise((resolve, reject) => {

        const stream =
            cloudinary.uploader.upload_stream(

                {

                    folder: "users",

                },

                (error, result) => {

                    if (error)
                        return reject(error);

                    if (!result)
                        return reject(
                            new Error("Upload Failed")
                        );

                    resolve({

                        url: result.secure_url,

                        public_id:
                            result.public_id,

                    });

                }

            );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);

    });

};




export const deleteImage = async (
  public_id: string
): Promise<void> => {
  await cloudinary.uploader.destroy(public_id);
};