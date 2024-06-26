export default class CustomError extends Error {
	status: number;

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
