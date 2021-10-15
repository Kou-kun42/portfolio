const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
require("dotenv").config();
const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/blog");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

const port = process.env.PORT || 3000;

app.listen(port);
