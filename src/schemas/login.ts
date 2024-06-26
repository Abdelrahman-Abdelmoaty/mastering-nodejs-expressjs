import * as z from "zod";

const loginSchema = z
	.object({
		email: z.string().email().optional(),
		username: z.string().optional(),
		pwd: z.string({
			required_error: "Password is required",
		}),
	})
	.refine((data) => (data.email && !data.username) || (data.username && !data.email), {
		message: "Either 'email' or 'username' is required",
		path: ["email/username"],
	});

export default loginSchema;
export type LoginType = {
	pwd: string;
} & ({ email: string; username?: string } | { email?: string; username: string });
