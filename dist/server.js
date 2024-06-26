import express from "express";
const app = express();
const port = 8000;
app.get("/", (req, res) => {
	res.json("Hello, World!");
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map
