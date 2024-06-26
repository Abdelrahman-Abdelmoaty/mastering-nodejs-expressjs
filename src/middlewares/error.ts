import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";

const errorHandler = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.status) {
		res.status(err.status).json({
			error: true,
			message: err.message,
		});
	} else {
		res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};

export default errorHandler;
