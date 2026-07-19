import multer from "multer";
import type { Request } from "express";

const storage = multer.memoryStorage();


const fileFilter: multer.Options["fileFilter"] = (
    req: Request,
    file,
    cb
) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});