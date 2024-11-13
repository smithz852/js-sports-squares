const router = require("express").Router();
const { User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    const users = userData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      users,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/homepage");
    return;
  }

  res.render("login");
});

router.get("/profile", withAuth, async (req, res) => {
  console.log("User ID from session", req.session.user_id);
  try {
    // Retrieve user data from the database
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    console.log(userData);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const serializedUser = userData.get({ plain: true });
    console.log(serializedUser);
    // Render the profile page with user data
    res.render("profile", {
      user: serializedUser,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/howToPlay", withAuth, async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/howToPlay");
    return;
  }

  res.render("howToPlay");
});

router.get("/homepage", withAuth, (req, res) => {
  res.render("homepage", {
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
