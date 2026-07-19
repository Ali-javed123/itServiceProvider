interface UploadResponse {
    url: string;
    public_id: string;
}
export declare const uploadImage: (file: Express.Multer.File) => Promise<UploadResponse>;
export declare const deleteImage: (public_id: string) => Promise<void>;
export {};
//# sourceMappingURL=imageUploader.d.ts.map