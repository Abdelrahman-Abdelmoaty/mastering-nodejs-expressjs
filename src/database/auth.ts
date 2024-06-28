import prisma from "../lib/db";
import * as jose from "jose";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { RegisterType } from "../schemas/register";
import { LoginType } from "../schemas/login";
import { excludeFields } from "../lib/utils";

export const register = async (data: RegisterType) => {
	const userExists = await prisma.user.findUnique({
		where: {
			username: data.username,
		},
	});

	if (userExists) {
		return null;
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
		return null;
	}

	const match = await bcrypt.compare(data.pwd, user.pwd);

	if (!match) {
		return null;
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
			return null;
		}

		const user = await prisma.user.findUnique({
			where: {
				email: payload.email as string,
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

		const userWithoutPassword = excludeFields(user, ["pwd"]);
		return { ...userWithoutPassword, token: refreshedToken };
	} catch (error) {
		return null;
	}
};
