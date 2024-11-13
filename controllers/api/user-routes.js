const router = require("express").Router();
const { User } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
  try {
    const dbUserData = await User.findAll();
    res.status(200).json(dbUserData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create new user
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  console.log(req.body)
  console.log("connected");
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // console.log(dbUserData);

    if (!dbUserData) {
      res
        .status(404)
        .json({ message: "User not found" });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = dbUserData.username;
      req.session.user_id = dbUserData.id;
      console.log(
        "File: user-routes.js ~ line 57 ~ req.session.save ~ req.session.cookie",
        req.session.cookie
      );

      res
        .status(200)
        .json({ user: dbUserData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/game', withAuth, (req, res) => {
  // Render the game.handlebars template and pass any necessary data
  res.render('game', {
    loggedIn: req.session.loggedIn,
  });
});


router.get('/profile', withAuth, async (req, res) => {
  console.log('User ID from session', req.session.user_id)
  try {
    // Retrieve user data from the database
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });
    console.log(userData)
    if (!userData) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const serializedUser = userData.get({ plain: true })
    console.log(serializedUser)
    // Render the profile page with user data
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).end();
        return;
      }
      res.redirect('/login');
    });
  } else {
    res.status(404).end();
    res.render('/login');
  }
});


module.exports = router;
