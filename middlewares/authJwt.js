const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
verifyToken = (req, res, next) => {
    let token = req.session.token;
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: "Unauthorized!" });
            }
            req.userId = decoded.id;
            res.redirect("/");
        });
    } else {
        next();
    }
};
const authJwt = {
    verifyToken,
};
module.exports = authJwt;
