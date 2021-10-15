const express = require("express");
const multer = require("multer");
const Article = require("./../models/article");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const CONTENT_TYPES = {
    jpg: "image/jpg",
    png: "image/png",
    gif: "image/gif",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split(" ").join("_"));
    },
});

const upload = multer({ storage: storage });

router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
});

router.post(
    "/",
    upload.single("image"),
    async (req, res, next) => {
        req.article = new Article();
        next();
    },
    saveArticleAndRedirect("new")
);

router.put(
    "/:id",
    async (req, res, next) => {
        req.article = await Article.findById(req.params.id);
        next();
    },
    saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

function saveArticleAndRedirect(mode) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        let type = CONTENT_TYPES[req.file.filename.split(".")[-1]];
        article.image.data = fs.readFileSync(
            path.join("uploads/" + req.file.filename)
        );
        article.image.contentType = type;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${mode}`, { article: article });
        }
    };
}

module.exports = router;
