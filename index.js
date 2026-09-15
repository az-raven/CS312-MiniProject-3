const PORT = 8080;

// imports
const express = require('express');
const ejs = require('ejs');

// mock db
const posts = [
	{
		title: "My Blog Post",
		author: "Rose Hankins",
		created: new Date("Mon Sep 14 2026 17:45:11 GMT-0700 (Mountain Standard Time)"),
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
];

// create router and apply basic middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"))


// template routes
app.get("/", async (req, res) => {
	const data = {
		editing_post: false,
		posts
	};

	res.status(200).send(
		await ejs.renderFile("templates/index.ejs", data, { })
	);
});

app.get("/editor/:index", async (req, res) => {
	const { index } = req.params;

	const data = {
		editing_post: parseInt(index),
		posts
	};

	res.status(200).send(
		await ejs.renderFile("templates/index.ejs", data, { })
	);
});

app.post("/post/:index", async (req, res) => {
	const { title, author, created, content } = req.body;
	const { index } = req.params;

	if (index == "new") {
		posts.push({
			title,
			author,
			created: new Date(created),
			content
		});
	} else {
		posts[req.params.index] = {
			title,
			author,
			created: new Date(created),
			content
		};
	}
	posts.sort((a, b) => a.created - b.created);

	res.redirect(302, "/");
});

app.post("/post/:index/delete", async (req, res) => {
	const { index } = req.params;

	posts.splice(index, 1);

	res.redirect(302, "/");
});


// start server
app.listen(PORT);
