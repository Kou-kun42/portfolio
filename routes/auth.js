const express = require("express");
const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", verifySignUp.checkExistingUser, (req, res) => {
    controller.signup(req, res);
});
router.get("/signin", authJwt.verifyToken, (req, res) => {
    res.redirect("/");
});
router.post("/signin", (req, res) => {
    controller.signin(req, res);
});
router.get("/signout", (req, res) => {
    controller.signout(req, res);
});

module.exports = router;
