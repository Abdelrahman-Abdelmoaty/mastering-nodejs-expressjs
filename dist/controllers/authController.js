"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.login = exports.register = void 0;
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const auth = __importStar(require("../database/auth"));
const register_1 = __importDefault(require("../schemas/register"));
const login_1 = __importDefault(require("../schemas/login"));
// @desc Register a user
// @route POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        pwd: req.body.pwd,
    };
    try {
        register_1.default.parse(data);
    }
    catch (error) {
        const err = new CustomError_1.default(error.errors[0].message);
        err.status = 400;
        return next(err);
    }
    let user = null;
    try {
        user = await auth.register(data);
    }
    catch (error) {
        const err = new CustomError_1.default(error.message);
        err.status = 500;
        return next(err);
    }
    if (!user) {
        const error = new CustomError_1.default("User already exists");
        error.status = 409;
        return next(error);
    }
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
};
exports.register = register;
// @desc Login a user
// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
    const data = {
        email: req.body.email,
        username: req.body.username,
        pwd: req.body.pwd,
    };
    try {
        login_1.default.parse(data);
    }
    catch (error) {
        const err = new CustomError_1.default(error.errors[0].message);
        err.status = 400;
        return next(err);
    }
    let user = null;
    try {
        user = await auth.login(data);
    }
    catch (error) {
        const err = new CustomError_1.default(error.message);
        err.status = 500;
        return next(err);
    }
    if (!user) {
        const error = new CustomError_1.default("Invalid credentials");
        error.status = 401;
        return next(error);
    }
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
    });
};
exports.login = login;
// @desc Get session user
// @route GET /api/auth/session
// @access Private
const getSession = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        const error = new CustomError_1.default("Unauthorized");
        error.status = 401;
        return next(error);
    }
    let user = null;
    try {
        user = await auth.getSession(token);
    }
    catch (error) {
        const err = new CustomError_1.default(error.message);
        err.status = 500;
        return next(err);
    }
    if (!user) {
        const error = new CustomError_1.default("Unauthorized");
        error.status = 401;
        return next(error);
    }
    res.status(200).json({
        success: true,
        message: "Session retrieved successfully",
        data: user,
    });
};
exports.getSession = getSession;
//# sourceMappingURL=authController.js.map