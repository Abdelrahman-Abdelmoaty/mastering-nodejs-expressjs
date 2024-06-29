import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.CLIENT_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.CLIENT_REFRESH_TOKEN });

const sendEmail = async (email: string, subject: string, text: string, html: string) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: process.env.EMAIL_USER,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.CLIENT_REFRESH_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_SENDER,
			to: email,
			subject,
			text,
		};
		const result = await transporter.sendMail(mailOptions);
		return result;
	} catch (error) {
		throw error;
	}
};

export default sendEmail;
