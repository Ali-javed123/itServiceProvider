export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}
export declare function publishEmail(payload: EmailPayload): Promise<void>;
//# sourceMappingURL=emailPublisher.d.ts.map