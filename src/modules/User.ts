import mongoose, { Schema, Document } from "mongoose";

export interface isUser extends Document {
    email: string;
    password: string;
    name: string;
    age: number;
    fullName: string;
image: {
    url: string;
    public_id: string;
};
    gender: "male" | "female";
 }

export const User: Schema<isUser> = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    fullName: { type: String, required: true },
    image: {
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    },
    gender: { type: String, enum: ["male", "female"], required: true },
});

export const UserModel = mongoose.model<isUser>("Auth", User);
