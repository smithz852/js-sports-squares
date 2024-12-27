const router = require("express").Router();

const userRoutes = require("./user-routes");
const sportFetch = require("./sportFetch")
const gamesAvailable = require("./gamesAvailable")
const gameDateInfo = require("./gameDateInfo")
const nflAPI = require("./nflApiFetch")

router.use("/users", userRoutes);
router.use("/sportFetch", sportFetch);
router.use("/gamesAvailable", gamesAvailable);
router.use("/gameDateInfo", gameDateInfo);
router.use("/nflApiFetch", nflAPI)



module.exports = router;
