"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).json({
            error: true,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};
exports.default = errorHandler;
//# sourceMappingURL=error.js.map