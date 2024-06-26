import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new CustomError("Not found");
	error.status = 404;
	next(error);
};

export default notFound;
