const User = require("../models/user");
checkExistingUser = (req, res, next) => {
    User.count().exec((err, count) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (count >= 1) {
            res.status(400).send({
                message: "Failed! User is already created!",
            });
            return;
        } else {
            User.findOne({
                username: req.body.username,
            }).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (user) {
                    res.status(400).send({
                        message: "Failed! Username is already in use!",
                    });
                    return;
                } else {
                    next();
                }
            });
        }
    });
};
const verifySignUp = {
    checkExistingUser,
};
module.exports = verifySignUp;
