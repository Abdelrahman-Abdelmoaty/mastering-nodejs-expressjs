import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";
import { getSession } from "../database/auth";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(" ")[1];
	try {
		if (!token) {
			throw new Error("Unauthorized");
		}
		const session = await getSession(token);
		if (!session) {
			throw new Error("Unauthorized");
		}

		next();
	} catch (error) {
		const err = new CustomError(error.message);
		err.status = 401;
		return next(err);
	}
};

export default authenticate;
