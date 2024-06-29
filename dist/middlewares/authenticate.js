"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const auth_1 = require("../database/auth");
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (!token) {
            throw new Error("Unauthorized");
        }
        const session = await (0, auth_1.getSession)(token);
        if (!session) {
            throw new Error("Unauthorized");
        }
        next();
    }
    catch (error) {
        const err = new CustomError_1.default(error.message);
        err.status = 401;
        return next(err);
    }
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map