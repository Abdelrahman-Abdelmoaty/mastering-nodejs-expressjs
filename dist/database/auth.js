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
const db_1 = __importDefault(require("../lib/db"));
const jose = __importStar(require("jose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../lib/utils");
const register = async (data) => {
    const userExists = await db_1.default.user.findUnique({
        where: {
            username: data.username,
        },
    });
    if (userExists) {
        return null;
    }
    const user = await db_1.default.user.create({
        data: {
            username: data.username,
            email: data.email,
            pwd: await bcrypt_1.default.hash(data.pwd, 10),
        },
    });
    const secretKey = await jose.importJWK({
        kty: "oct",
        k: jose.base64url.encode(process.env.JWT_SECRET),
    }, "HS256");
    const token = await new jose.SignJWT({ username: user.username, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secretKey);
    const userWithoutPassword = (0, utils_1.excludeFields)(user, ["pwd"]);
    return { ...userWithoutPassword, token };
};
exports.register = register;
const login = async (data) => {
    let user = null;
    if (data.email) {
        user = await db_1.default.user.findUnique({
            where: {
                email: data.email,
            },
        });
    }
    else if (data.username) {
        user = await db_1.default.user.findUnique({
            where: {
                username: data.username,
            },
        });
    }
    if (!user) {
        return null;
    }
    const match = await bcrypt_1.default.compare(data.pwd, user.pwd);
    if (!match) {
        return null;
    }
    const secretKey = await jose.importJWK({
        kty: "oct",
        k: jose.base64url.encode(process.env.JWT_SECRET),
    }, "HS256");
    const token = await new jose.SignJWT({ username: user.username, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secretKey);
    const userWithoutPassword = (0, utils_1.excludeFields)(user, ["pwd"]);
    return { ...userWithoutPassword, token };
};
exports.login = login;
const getSession = async (token) => {
    try {
        const secretKey = await jose.importJWK({
            kty: "oct",
            k: jose.base64url.encode(process.env.JWT_SECRET),
        }, "HS256");
        const { payload } = await jose.jwtVerify(token, secretKey);
        if (!payload.email) {
            return null;
        }
        const user = await db_1.default.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (!user) {
            return null;
        }
        const refreshedToken = await new jose.SignJWT({
            username: user.username,
            email: user.email,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(secretKey);
        const userWithoutPassword = (0, utils_1.excludeFields)(user, ["pwd"]);
        return { ...userWithoutPassword, token: refreshedToken };
    }
    catch (error) {
        return null;
    }
};
exports.getSession = getSession;
//# sourceMappingURL=auth.js.map