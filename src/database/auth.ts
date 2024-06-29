import prisma from "../lib/db";
import * as jose from "jose";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { RegisterType } from "../schemas/register";
import { LoginType } from "../schemas/login";
import { excludeFields } from "../lib/utils";
import CustomError from "../errors/CustomError";
import sendEmail from "../lib/nodemailer";

export const register = async (data: RegisterType) => {
	const userExists = await prisma.user.findUnique({
		where: {
			username: data.username,
		},
	});

	if (userExists) {
		const error = new CustomError("Username already exists");
		error.status = 400;
		throw error;
	}

	const user = await prisma.user.create({
		data: {
			username: data.username,
			email: data.email,
			pwd: await bcrypt.hash(data.pwd, 10),
		},
	});

	const secretKey = await jose.importJWK(
		{
			kty: "oct",
			k: jose.base64url.encode(process.env.JWT_SECRET),
		},
		"HS256"
	);

	const token = await new jose.SignJWT({ username: user.username, email: user.email })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("2h")
		.sign(secretKey);

	const userWithoutPassword = excludeFields(user, ["pwd"]);
	return { ...userWithoutPassword, token };
};

export const login = async (data: LoginType) => {
	let user: User | null = null;

	if (data.email) {
		user = await prisma.user.findUnique({
			where: {
				email: data.email,
			},
		});
	} else if (data.username) {
		user = await prisma.user.findUnique({
			where: {
				username: data.username,
			},
		});
	}

	if (!user) {
		const error = new CustomError("User not found");
		error.status = 404;
		throw error;
	}

	const match = await bcrypt.compare(data.pwd, user.pwd);

	if (!match) {
		const error = new CustomError("Invalid credentials");
		error.status = 401;
		throw error;
	}

	const secretKey = await jose.importJWK(
		{
			kty: "oct",
			k: jose.base64url.encode(process.env.JWT_SECRET),
		},
		"HS256"
	);

	const token = await new jose.SignJWT({ username: user.username, email: user.email })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("2h")
		.sign(secretKey);

	const userWithoutPassword = excludeFields(user, ["pwd"]);
	return { ...userWithoutPassword, token };
};

export const getSession = async (token: string) => {
	try {
		const secretKey = await jose.importJWK(
			{
				kty: "oct",
				k: jose.base64url.encode(process.env.JWT_SECRET),
			},
			"HS256"
		);

		const { payload } = await jose.jwtVerify(token, secretKey);
		if (!payload.email) {
			const error = new CustomError("Invalid token");
			error.status = 401;
			throw error;
		}

		const user = await prisma.user.findUnique({
			where: {
				email: payload.email as string,
			},
		});

		if (!user) {
			const error = new CustomError("User not found");
			error.status = 404;
			throw error;
		}

		const refreshedToken = await new jose.SignJWT({
			username: user.username,
			email: user.email,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("2h")
			.sign(secretKey);

		const userWithoutPassword = excludeFields(user, ["pwd"]);
		return { ...userWithoutPassword, token: refreshedToken };
	} catch (error) {
		return null;
	}
};

export const forgotPassword = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		const error = new CustomError("User not found");
		error.status = 404;
		throw error;
	}
	try {
		await sendEmail(
			user.email,
			"Password Reset",
			`Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password?email=${user.email}`,
			`<a href="${process.env.CLIENT_URL}/reset-password?email=${user.email}">Click here to reset your password</a>`
		);
	} catch (error) {
		console.log("Error sending email");
		console.log(error);
	}
};
