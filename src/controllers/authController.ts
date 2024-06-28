import CustomError from "../errors/CustomError";
import * as auth from "../database/auth";
import registerSchema from "../schemas/register";
import loginSchema from "../schemas/login";
import { Request, Response, NextFunction } from "express";
import UserType from "../types/user";

// @desc Register a user
// @route POST /api/auth/register
// @access Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
	const data = {
		username: req.body.username,
		email: req.body.email,
		pwd: req.body.pwd,
	};

	try {
		registerSchema.parse(data);
	} catch (error) {
		const err = new CustomError(error.errors[0].message);
		err.status = 400;
		return next(err);
	}

	let user: UserType | null = null;
	try {
		user = await auth.register(data);
	} catch (error) {
		const err = new CustomError(error.message);
		err.status = 500;
		return next(err);
	}

	if (!user) {
		const error = new CustomError("User already exists");
		error.status = 409;

		return next(error);
	}

	res.status(201).json({
		success: true,
		message: "User registered successfully",
		data: user,
	});
};

// @desc Login a user
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
	const data = {
		email: req.body.email,
		username: req.body.username,
		pwd: req.body.pwd,
	};

	try {
		loginSchema.parse(data);
	} catch (error) {
		const err = new CustomError(error.errors[0].message);
		err.status = 400;
		return next(err);
	}

	let user: UserType | null = null;
	try {
		user = await auth.login(data);
	} catch (error) {
		const err = new CustomError(error.message);
		err.status = 500;
		return next(err);
	}

	if (!user) {
		const error = new CustomError("Invalid credentials");
		error.status = 401;

		return next(error);
	}

	res.status(200).json({
		success: true,
		message: "User logged in successfully",
		data: user,
	});
};

// @desc Get session user
// @route GET /api/auth/session
// @access Private
export const getSession = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		const error = new CustomError("Unauthorized");
		error.status = 401;

		return next(error);
	}

	let user: UserType | null = null;
	try {
		user = await auth.getSession(token);
	} catch (error) {
		const err = new CustomError(error.message);
		err.status = 500;
		return next(err);
	}

	if (!user) {
		const error = new CustomError("Unauthorized");
		error.status = 401;

		return next(error);
	}

	res.status(200).json({
		success: true,
		message: "Session retrieved successfully",
		data: user,
	});
};
