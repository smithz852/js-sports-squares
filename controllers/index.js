const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./home-routes.js");

router.use("/api", apiRoutes);

router.get('/game', async(req, res) => {
     res.render('game')
})
router.use("/", homeRoutes);

module.exports = router;
