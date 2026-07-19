import { Document } from "mongoose";
export interface IServiceCategory extends Document {
    serviceCategory: string;
    slug: string;
    createdAt: Date;
    unique: true;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<IServiceCategory, {}, {}, {}, Document<unknown, {}, IServiceCategory, {}, import("mongoose").DefaultSchemaOptions> & IServiceCategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IServiceCategory>;
export default _default;
//# sourceMappingURL=service.category.models.d.ts.map