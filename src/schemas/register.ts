import * as z from "zod";

const registerSchema = z.object({
	email: z
		.string({
			required_error: "email is required",
		})
		.email(),
	username: z.string({
		required_error: "username is required",
	}),
	pwd: z.string({
		required_error: "Password is required",
	}),
});

export default registerSchema;
export type RegisterType = {
	email: string;
	username: string;
	pwd: string;
};
