const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
verifyToken = (req, res, next) => {
    let token = req.session.token;
    if (!token) {
        res.render("auth/signin");
    } else {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: "Unauthorized!" });
                return;
            } else {
                next();
            }
        });
    }
};
const authJwt = {
    verifyToken,
};
module.exports = authJwt;
