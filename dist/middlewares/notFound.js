"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const notFound = (req, res, next) => {
    const error = new CustomError_1.default("Not found");
    error.status = 404;
    next(error);
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map