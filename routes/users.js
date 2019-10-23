const express = require("express"),
    bcrypt = require("bcryptjs"),
    router = express.Router();

const UserModel = require("../models/users");

router.get("/login", async (req, res, next) => {
    res.render("template", {
        locals: {
            title: "Login",
            isLoggedIn: req.session.is_logged_in
        },
        partials: {
            partial: "partial-login"
        }
    });
});

router.get("/logout", (req, res, next) => {
    req.session.destroy();
    res.status(200).redirect("/");
});

router.get("/signup", async (req, res, next) => {
    res.render("template", {
        locals: {
            title: "Sign Up",
            isLoggedIn: req.session.is_logged_in
        },
        partials: {
            partial: "partial-signup"
        }
    });
});

router.post("/signup", async (req, res, next) => {
    const { first_name, last_name, email_address } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new UserModel(first_name, last_name, email_address, hash);
    const addUser = await user.save();

    if (addUser) {
        res.status(200).redirect("/users/login");
    } else {
        res.status(500);
    }
});

router.post("/login", async (req, res, next) => {
    const { email_address, password } = req.body;

    const user = new UserModel(null, null, email_address, password);

    const response = await user.login();
    console.log(response);

    if (!!response.isValid) {
        const { id, first_name, last_name } = response;
        req.session.is_logged_in = true;
        req.session.first_name = first_name;
        req.session.last_name = last_name;
        req.session.user_id = id;
        res.status(200).redirect("/");
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
