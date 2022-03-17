const express = require("express");
const multer = require("multer");
const Article = require("./../models/article");
const { authJwt } = require("../middlewares");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");
const article = require("./../models/article");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(sanitize(file.originalname)));
    },
});

const upload = multer({ storage: storage });

router.get("/new", authJwt.verifyToken, (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", authJwt.verifyToken, async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

router.post(
    "/",
    authJwt.verifyToken,
    upload.single("image"),
    async (req, res, next) => {
        req.article = new Article();
        next();
    },
    saveArticleAndRedirect("new")
);

router.put(
    "/:id",
    authJwt.verifyToken,
    async (req, res, next) => {
        req.article = await Article.findById(req.params.id);
        next();
    },
    saveArticleAndRedirect("edit")
);

router.delete("/:id", authJwt.verifyToken, async (req, res) => {
    const article = await Article.findById(req.params.id);
    fs.unlink(article.image.filename, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

function saveArticleAndRedirect(mode) {
    authJwt.verifyToken;
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        if (mode == "new") {
            article.image.filename = path.join("uploads/" + req.file.filename);
        }
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect("/");
        } catch (e) {
            if (mode == "new") {
                res.redirect(`/articles/${mode}`);
            } else if (mode == "edit") {
                res.redirect(`/articles/${mode}/${article.id}`);
            } else {
                res.redirect("/");
            }
        }
    };
}

module.exports = router;
