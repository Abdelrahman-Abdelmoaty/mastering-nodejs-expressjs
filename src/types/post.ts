type PostType = {
	comments: {
		commentId: number;
		comment: string;
	}[];
	likes: {
		userId: number;
	}[];
} & {
	postId: number;
	userId: number;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

export default PostType;
