export const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            res.json({
                message: error.message,
            });
        }
    };
};
//# sourceMappingURL=TryCatch.js.map