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
        }
        next();
    });
};
const verifySignUp = {
    checkExistingUser,
};
module.exports = verifySignUp;
