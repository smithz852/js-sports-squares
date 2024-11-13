const router = require("express").Router();

const userRoutes = require("./user-routes");
const sportFetch = require("./sportFetch")
const gamesAvailable = require("./gamesAvailable")
const gameDateInfo = require("./gameDateInfo")

router.use("/users", userRoutes);
router.use("/sportFetch", sportFetch);
router.use("/gamesAvailable", gamesAvailable);
router.use("/gameDateInfo", gameDateInfo);



module.exports = router;
