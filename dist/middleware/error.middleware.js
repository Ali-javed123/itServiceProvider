export const ErrorHandler = (error, req, res, next) => {
    res.status(500).json({
        success: false,
        message: error instanceof Error
            ? error.message
            : "Internal Server Error",
    });
};
//# sourceMappingURL=error.middleware.js.map