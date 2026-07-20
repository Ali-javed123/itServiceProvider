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
export declare const User: Schema<isUser>;
export declare const UserModel: mongoose.Model<isUser, {}, {}, {}, Document<unknown, {}, isUser, {}, mongoose.DefaultSchemaOptions> & isUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, isUser>;
//# sourceMappingURL=User.d.ts.map