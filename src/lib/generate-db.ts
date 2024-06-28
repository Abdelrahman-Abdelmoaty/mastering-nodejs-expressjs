import prisma from "./db";
import dotenv from "dotenv";
dotenv.config();

async function main() {
	// Insert Users
	let users = [];
	for (let i = 1; i <= 10; i++) {
		const user = await prisma.user.create({
			data: {
				username: `User${i}`,
				email: `user${i}@example.com`,
				pwd: `password${i}`,
			},
		});
		users.push(user);
	}

	// Insert posts, each user creates 2 posts
	let posts = [];
	for (const user of users) {
		for (let i = 1; i <= 2; i++) {
			const post = await prisma.post.create({
				data: {
					userId: user.userId,
					title: `Post ${i} by ${user.username}`,
					content: `This is post ${i} created by ${user.username}.`,
				},
			});
			posts.push(post);
		}
	}

	// Insert comments, each user comments on each post once
	for (const post of posts) {
		for (const user of users) {
			await prisma.comment.create({
				data: {
					postId: post.postId,
					userId: user.userId,
					comment: `This is a comment by ${user.username} on ${post.Title}.`,
				},
			});
		}
	}

	// Insert likes, each user likes each post once
	for (const post of posts) {
		for (const user of users) {
			await prisma.like.create({
				data: {
					postId: post.postId,
					userId: user.userId,
				},
			});
		}
	}
}

main()
	.catch((e) => {
		console.error(e);
		throw e;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
