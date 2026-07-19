interface UploadResponse {
    url: string;
    public_id: string;
}
export declare const uploadImage: (file: Express.Multer.File) => Promise<UploadResponse>;
export {};
//# sourceMappingURL=imageUploader.d.ts.map