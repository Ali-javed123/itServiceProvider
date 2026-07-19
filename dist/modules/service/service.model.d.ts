import type { Document, Types } from "mongoose";
export interface IService extends Document {
    category: Types.ObjectId;
    title: string;
    image: {
        url: string;
        public_id: string;
    };
    description: string;
    icon: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: import("mongoose").Model<IService, {}, {}, {}, Document<unknown, {}, IService, {}, import("mongoose").DefaultSchemaOptions> & IService & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IService>;
export default _default;
//# sourceMappingURL=service.model.d.ts.map